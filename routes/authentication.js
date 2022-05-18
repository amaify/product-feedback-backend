const express = require("express");
const authController = require("../controllers/authenticaiton");

const router = express.Router();

router.post("/register", authController.createUser);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);

module.exports = router;
