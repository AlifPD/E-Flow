const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const db = require("../../database/models");
const Op = db.Sequelize.Op;
const { s3Client } = require("../utils/utils")

const createAttendance = async (user_id, datetime, evidence) => {
    const date = new Date(datetime).toISOString().split("T")[0];
    const evidenceName = `${crypto.randomUUID()}.${evidence.mimetype.split('/')[1]}`

    let attendance = await db.Attendances.findOne({
        where: {
            user_id,
            clock_in: {
                [Op.gte]: new Date(`${date}T00:00:00`),
                [Op.lte]: new Date(`${date}T23:59:59`)
            }
        }
    });

    try {
        await s3Client.send(new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: evidenceName,
            Body: evidence.buffer,
            ContentType: evidence.mimetype
        }))
    } catch (error) {
        throw new Error("Failed upload image")
    }

    if (!attendance) {
        return await db.Attendances.create({
            user_id,
            clock_in: datetime,
            evidence_clock_in: evidenceName
        });
    } else {
        attendance.clock_out = datetime;
        attendance.evidence_clock_out = evidenceName;
        await attendance.save();
        return attendance;
    }
};

const getLatestAttendance = async (user_id) => {
    const attendance = await db.Attendances.findOne({
        where: { user_id },
        order: [["updatedAt", "DESC"]]
    });

    let evidence_clock_in = ""
    let evidence_clock_out = ""
    if (attendance.evidence_clock_in) {
        evidence_clock_in = await getSignedUrl(s3Client, new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: attendance.evidence_clock_in
        }), { expiresIn: 2 * 24 * 60 * 60 })
    }
    if (attendance.evidence_clock_out) {
        evidence_clock_out = await getSignedUrl(s3Client, new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: attendance.evidence_clock_out
        }), { expiresIn: 2 * 24 * 60 * 60 })
    }

    const attendanceData = attendance.get({ plain: true });
    attendance.evidence_clock_in = evidence_clock_in
    attendance.evidence_clock_out = evidence_clock_out
    delete attendanceData.id;
    delete attendanceData.user_id;

    return attendanceData
};

const getAttendanceList = async (userInfo, employee_id, isAdminView, start_time, end_time, page = 1, limit = 15) => {
    const offset = (page - 1) * limit;
    const startDate = start_time ? new Date(start_time) : new Date(new Date().setDate(new Date().getDate() - 7));
    const endDate = end_time ? new Date(end_time) : new Date(new Date().setHours(23, 59, 59, 999));

    const whereCondition = {
        [Op.or]: [
            {
                clock_in: {
                    [Op.between]: [startDate, endDate]
                }
            },
            {
                clock_out: {
                    [Op.between]: [startDate, endDate]
                }
            }
        ]
    };

    if (!isAdminView) {
        whereCondition.user_id = userInfo.id;
    } else {
        if (userInfo.roles.includes('ADMIN')) {
            if (employee_id) {
                whereCondition.user_id = employee_id;
            }
        } else {
            whereCondition.user_id = userInfo.id;
        }
    }

    const { count, rows } = await db.Attendances.findAndCountAll({
        where: whereCondition,
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: { model: db.Users, attributes: ["employee_id", "fullname"] },
        order: [["createdAt", "DESC"]]
    });

    const results = await Promise.all(rows.map(async (row) => {
        let evidence_clock_in = "";
        let evidence_clock_out = "";

        if (row.evidence_clock_in) {
            evidence_clock_in = await getSignedUrl(s3Client, new GetObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: row.evidence_clock_in
            }), { expiresIn: 2 * 24 * 60 * 60 });
        }
        if (row.evidence_clock_out) {
            evidence_clock_out = await getSignedUrl(s3Client, new GetObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: row.evidence_clock_out
            }), { expiresIn: 2 * 24 * 60 * 60 });
        }

        return {
            ...row.toJSON(),
            evidence_clock_in,
            evidence_clock_out
        };
    }));

    return {
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        data: results
    };

};

module.exports = {
    getLatestAttendance,
    getAttendanceList,
    createAttendance
}