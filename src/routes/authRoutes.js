const express = require("express");
const multer = require('multer');
const authJWT = require("../middlewares/authJWT")
const authController = require("../controllers/authController");

const router = express.Router();
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.post("/login", authController.login);
router.post("/register", authJWT("ADMIN"), upload.single('profile_picture'), authController.register);
router.post("/logout", authController.logout);

module.exports = router;