const express = require("express");
const userController = require("../controllers/userController");
const authJWT = require("../middlewares/authJWT");

const router = express.Router();

router.get("/detail", authJWT(), userController.getUser);

router.get("/", authJWT("ADMIN"), userController.getAllUsers);

router.put("/:employee_id", authJWT("ADMIN"), userController.updateUser);

module.exports = router;
