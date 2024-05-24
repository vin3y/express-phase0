const express = require("express");
const router = express.Router();
const User = require("../models/UsersModel");

router.get("/users-list", async (req, res) => {
  try {
    const ListUsers = await User.find({}, "username firstname");
    res.json({ status: "success", requestId: req.requestId, users: ListUsers });
  } catch (error) {
    res.status(500).json({
      status: "error",
      requsetId: req.requestId,
      error: error.message,
    });
  }
});

router.post("/create-user", async (req, res) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;
    if (!firstname || !lastname || !username || !email || !password) {
      return res.status(400).json({
        status: "error",
        requestId: req.requestId,
        error: "All fields are mandatory",
      });
    }
    if (password.length < 12) {
      return res.json(400).json({
        status: "error",
        requestId: req.requestId,
        error: "Password length should not be 12",
      });
    }

    const newUser = User({ firstname, lastname, username, email, password });
    await newUser.save();
    res.status(201).json({
      status: "success",
      requestId: req.requestId,
      message: "user created",
      user: {
        id: newUser._id,
        firstname: newUser.firstname,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      requsetId: req.requestId,
      error: error.message,
    });
  }
});

module.exports = router;
