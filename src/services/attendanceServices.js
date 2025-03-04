const db = require("../../database/models");
const Op = db.Sequelize.Op;

const getLatestAttendance = async (user_id) => {
    return await db.Attendances.findOne({
        where: { user_id },
        order: [["createdAt", "DESC"]]
    });
};

const getAttendanceList = async (user_id, employee_id, isAdminView, start_time, end_time, page = 1, limit = 15) => {
    const offset = (page - 1) * limit;
    const startDate = start_time ? new Date(start_time) : new Date(new Date().setDate(new Date().getDate() - 7));
    const endDate = end_time ? new Date(end_time) : new Date(new Date().setHours(23, 59, 59, 999));

    let whereCondition = {
        createdAt: {
            [Op.between]: [startDate, endDate]
        }
    };

    if (!isAdminView) {
        whereCondition.user_id = user_id;
    } else if (employee_id) {
        whereCondition.user_id = employee_id;
    }

    const { count, rows } = await db.Attendances.findAndCountAll({
        where: whereCondition,
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: { model: db.Users, attributes: ["employee_id", "fullname"] },
        order: [["createdAt", "DESC"]]
    });

    return {
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        data: rows
    };
};

const createAttendance = async (user_id, datetime) => {
    const date = new Date(datetime).toISOString().split("T")[0];

    let attendance = await db.Attendances.findOne({
        where: {
            user_id,
            clock_in: {
                [Op.gte]: new Date(`${date}T00:00:00`),
                [Op.lte]: new Date(`${date}T23:59:59`)
            }
        }
    });

    if (!attendance) {
        return await db.Attendances.create({
            user_id,
            clock_in: datetime
        });
    } else {
        attendance.clock_out = datetime;
        await attendance.save();
        return attendance;
    }
};

module.exports = {
    getLatestAttendance,
    getAttendanceList,
    createAttendance
}