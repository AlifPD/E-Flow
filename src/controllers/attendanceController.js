const attendanceService = require("../services/attendanceServices");

const getLatestAttendance = async (req, res) => {
    try {
        const user_id = req.user.id;
        const attendance = await attendanceService.getLatestAttendance(user_id);
        res.json({
            info: "Success retrieve latest attendance",
            data: attendance
        });
    } catch (error) {
        res.status(500).json({ info: error.message });
    }
};

const getAttendanceList = async (req, res) => {
    try {
        const { employee_id, start_time, end_time } = req.query;
        const isAdminView = req.query.isAdminView === "true";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15;
        const user_id = req.user.id;

        const attendanceList = await attendanceService.getAttendanceList(user_id, employee_id, isAdminView, start_time, end_time, page, limit);
        
        res.json({
            info: "Success retrieve attendance list",
            data: attendanceList
        });
    } catch (error) {
        res.status(500).json({ info: error.message });
    }
};


const createAttendance = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { datetime } = req.body;

        const result = await attendanceService.createAttendance(user_id, datetime);
        delete result["id"]
        delete result["user_id"]

        res.json({
            info: "Success create attendance",
            data: result
        });
    } catch (error) {
        res.status(500).json({ info: error.message });
    }
};

module.exports = {
    getLatestAttendance,
    getAttendanceList,
    createAttendance
}