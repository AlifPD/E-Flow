const express = require("express");

const attendanceController = require("../controllers/attendanceController");
const authJWT = require("../middlewares/authJWT");

const router = express.Router();

router.get("/latest", authJWT(), attendanceController.getLatestAttendance);
router.get("/", authJWT(), attendanceController.getAttendanceList);
router.post("/", authJWT(), attendanceController.createAttendance);

module.exports = router