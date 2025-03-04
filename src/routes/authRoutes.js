const express = require("express");
const authJWT = require("../middlewares/authJWT")
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authJWT("ADMIN"), authController.register);

module.exports = router;