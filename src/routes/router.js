const express = require("express")
const authRouter = require("./authRoutes")
const attendanceRouter = require("./attendanceRoutes")

const router = express.Router()

// AUTH
router.use("/auth", authRouter);

// ATTENDANCE
router.use("/attendance", attendanceRouter)

module.exports = router