const express = require("express");
const router = express.Router();
const User = require("../models/UsersModel");
const UserController = require("../controller/UserController");
const AuthenticateMiddleWare = require("../middlewares/AuthenticateMiddleware");

router.get("/users-list", AuthenticateMiddleWare, UserController.getAllUser);

// router.post("/create-user", UserController.createNewUser);

module.exports = router;
