const express = require("express");
const multer = require('multer');
const authJWT = require("../middlewares/authJWT");
const attendanceController = require("../controllers/attendanceController");

const router = express.Router();
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.get("/latest", authJWT(), attendanceController.getLatestAttendance);
router.get("/", authJWT(), attendanceController.getAttendanceList);
router.post("/", authJWT(), upload.single('evidence'), attendanceController.createAttendance);

module.exports = router