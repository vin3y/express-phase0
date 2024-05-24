const User = require("../models/UsersModel");

exports.getAllUser = async (req, res) => {
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
};

exports.createNewUser = async (req, res) => {
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

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        requestId: req.requestId,
        error: "Username or email already exists",
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
};
