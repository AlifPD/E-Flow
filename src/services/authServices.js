const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const sharp = require("sharp");

const db = require("../../database/models");
const { s3Client } = require("../utils/utils");

const register = async (userData, profilePicture) => {
    const { email, password, fullname, phone, address, department } = userData;
    const role_type_id = parseInt(userData.role_type_id)

    const roleType = await db.RoleTypes.findByPk(role_type_id);
    if (!roleType) throw new Error("Invalid Role");

    const existingEmail = await db.Users.findOne({ where: { email } });
    if (existingEmail) throw new Error("Employee already exists");

    let employee_id = "";
    let isUnique = false;

    while (!isUnique) {
        if (role_type_id === 1) {
            let deptInitials = department.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3);
            if (deptInitials.length === 2) deptInitials += "D";

            const randomDigits = Math.floor(100000 + Math.random() * 900000);
            employee_id = `${deptInitials}${randomDigits}`;
        } else if (role_type_id === 2) {
            const randomDigits = Math.floor(1000 + Math.random() * 9000);
            employee_id = `ADMIN${randomDigits}`;
        } else {
            throw new Error("Invalid Role");
        }

        isUnique = !(await db.Users.findOne({ where: { employee_id } }));
    }

    const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));
    const profile_picture = `${crypto.randomUUID()}.${profilePicture.mimetype.split('/')[1]}`
    const profile_thumbnail = `${crypto.randomUUID()}.${profilePicture.mimetype.split('/')[1]}`
    const thumbnailBuffer = await sharp(profilePicture.buffer).resize({ height: 25, width: 25, fit: 'contain' }).toBuffer()

    try {
        await Promise.all([
            s3Client.send(new PutObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: profile_picture,
                Body: profilePicture.buffer,
                ContentType: profilePicture.mimetype
            })),
            s3Client.send(new PutObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: profile_thumbnail,
                Body: thumbnailBuffer,
                ContentType: profilePicture.mimetype
            }))
        ]);
    } catch (error) {
        throw new Error("Failed upload image")
    }

    const newUser = await db.Users.create({
        employee_id,
        email,
        password: hashedPassword,
        fullname,
        phone,
        address,
        department,
        profile_picture,
        profile_thumbnail
    });

    await db.Roles.create({
        user_id: newUser.id,
        role_type_id
    });

    return { info: "Registration successful" };
};

const login = async (identifier, password) => {
    const user = await db.Users.findOne({
        where: {
            [db.Sequelize.Op.or]: [{ employee_id: identifier }, { email: identifier }]
        },
        include: { model: db.Roles, include: db.RoleTypes }
    });

    if (!user) throw new Error("Invalid credentials");

    const isPassCorrect = await bcrypt.compare(password, user.password);
    if (!isPassCorrect) throw new Error("Invalid credentials");

    let profile_picture = ""
    let profile_thumbnail = ""
    if(user.profile_picture){
        profile_picture = await getSignedUrl(s3Client, new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: user.profile_picture
        }), { expiresIn: 2 * 24 * 60 * 60 })
    }
    if(user.profile_thumbnail){
        profile_thumbnail = await getSignedUrl(s3Client, new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: user.profile_thumbnail
        }), { expiresIn: 2 * 24 * 60 * 60 })
    }

    const userRoles = user.Roles.map(role => role.RoleType.role_name);
    const { employee_id, fullname, department } = user
    const token = jwt.sign(
        {
            user_id: user.id,
            roles: userRoles
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.JWT_EXPIRES
        }
    );

    return {
        token,
        userInfo: {
            employee_id,
            fullname,
            department,
            profile_picture,
            profile_thumbnail,
            roles: userRoles
        }
    };
};

module.exports = {
    login,
    register
}