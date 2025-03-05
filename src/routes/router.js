const express = require("express")
const authRouter = require("./authRoutes")
const attendanceRouter = require("./attendanceRoutes")
const userRouter = require("./userRoutes");

const router = express.Router()

// AUTH
router.use("/auth", authRouter);

// ATTENDANCE
router.use("/attendance", attendanceRouter)

// USER
router.use("/users", userRouter);

module.exports = router