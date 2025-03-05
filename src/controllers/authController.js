const authService = require("../services/authServices");

const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        const { token, userInfo, tokenStorage } = await authService.login(identifier, password);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        });
        res.json({
            info: "Success login",
            data: { ...userInfo, tokenStorage }
        });
    } catch (error) {
        res.status(500).json({ info: error.message });
    }
};

const register = async (req, res) => {
    try {
        await authService.register(req.body, req.file);
        res.status(201).json({ info: "User registered successfully" });
    } catch (error) {
        res.status(400).json({ info: error.message });
    }
};

const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    return res.json({ info: "Logged out successfully" });
};


module.exports = {
    login,
    register,
    logout
}