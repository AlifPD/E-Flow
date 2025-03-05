const userService = require("../services/userServices");

const getUser = async (req, res) => {
    try {
        const user = await userService.getUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ info: "User not found" });
        }
        res.json({ info: "Success", data: user });
    } catch (error) {
        res.status(500).json({ info: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json({ info: "Success", data: users });
    } catch (error) {
        res.status(500).json({ info: error.message });
    }
};

const updateUser = async (req, res) => {
    const { employee_id } = req.params;
    const updateData = req.body;

    try {
        const updatedUser = await userService.updateUser(employee_id, updateData);
        if (!updatedUser) {
            return res.status(404).json({ info: "User not found" });
        }
        res.json({ info: "User updated successfully", data: updatedUser });
    } catch (error) {
        res.status(500).json({ info: error.message });
    }
};

module.exports = { getUser, getAllUsers, updateUser };
