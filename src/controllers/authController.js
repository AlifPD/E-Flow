const authService = require("../services/authServices");

const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        const { token, userRoles } = await authService.login(identifier, password);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        });
        res.json({ role: userRoles });
    } catch (error) {
        res.status(401).json({ info: error.message });
    }
};

const register = async (req, res) => {
    try {
        await authService.register(req.body);
        res.status(201).json({ info: "User registered successfully" });
    } catch (error) {
        res.status(400).json({ info: error.message });
    }
};

module.exports = {
    login,
    register
}