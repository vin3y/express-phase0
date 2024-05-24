const express = require("express");
const router = express.Router();
const User = require("../models/UsersModel");
const UserController = require("../controller/UserController");

router.get("/users-list", UserController.getAllUser);

router.post("/create-user", UserController.createNewUser);

module.exports = router;
