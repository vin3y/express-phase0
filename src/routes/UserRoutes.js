const express = require("express");
const router = express.Router();
const UserController = require("../controller/UserController");
const AuthenticateMiddleWare = require("../middlewares/AuthenticateMiddleware");

router.get("/users-list", AuthenticateMiddleWare, UserController.getAllUser);
router.post("/edit-user/", AuthenticateMiddleWare, UserController.postEditUser);

module.exports = router;
