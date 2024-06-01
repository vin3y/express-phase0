const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/UsersModel");
const tokenCreator = require("../utils/tokenCreator");
const generateToken = require("../utils/tokenCreator");
const AuthController = require("../controller/AuthController");

router.post("/create-user", AuthController.createUserController);
router.post("/login", AuthController.loginController);

module.exports = router;
