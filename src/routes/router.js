const express = require("express")
const authRouter = require("./authRoutes")

const router = express.Router()

// AUTH
router.use("/auth", authRouter);

module.exports = router