const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../database/models");

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

    const userRoles = user.Roles.map(role => role.RoleType.role_name);
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

    return { token, userRoles };
};

const register = async (userData) => {
    const { employee_id, email, password, fullname, phone, address, profile_picture, department, role_type_id } = userData;

    const existingUser = await db.Users.findOne({
        where: {
            [db.Sequelize.Op.or]: [{ employee_id }, { email }]
        }
    });

    if (existingUser) throw new Error("Employee ID or Email already exists");

    const roleType = await db.RoleTypes.findByPk(role_type_id);
    if (!roleType) throw new Error("Invalid Role");

    const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));

    const newUser = await db.Users.create({
        employee_id,
        email,
        password: hashedPassword,
        fullname,
        phone,
        address,
        profile_picture,
        department
    });

    await db.Roles.create({
        user_id: newUser.id,
        role_type_id
    });

    return { info: "Registration successful" };
};


module.exports = {
    login,
    register
}