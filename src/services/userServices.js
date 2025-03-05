const db = require("../../database/models");

const getUserById = async (id) => {
    return await db.Users.findByPk(id, {
        attributes: { exclude: ["password"] },
    });
};

const getAllUsers = async () => {
    return await db.Users.findAll({
        attributes: { exclude: ["password"] },
    });
};

const updateUser = async (employee_id, updateData) => {
    const user = await db.Users.findOne({ where: { employee_id } });
    if (!user) return null;

    await user.update(updateData);
    return user;
};

module.exports = { getUserById, getAllUsers, updateUser };
