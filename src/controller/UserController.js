const User = require("../models/UsersModel");
const bcrypt = require("bcrypt");

exports.getAllUser = async (req, res) => {
  try {
    const ListUsers = await User.find({}, "username firstname");
    res.json({ status: "success", requestId: req.requestId, users: ListUsers });
  } catch (error) {
    res.status(500).json({
      status: "error",
      requestId: req.requestId,
      error: error.message,
    });
  }
};

exports.postEditUser = async (req, res) => {
  const { id, firstname, lastname, username, email, password } = req.body;
  try {
    if (!id) {
      return res
        .json({
          status: "error",
          requestId: req.requestId,
          message: "User Id Not Given",
        })
        .status(400);
    }

    const user = await User.findById(id).exec();
    if (!user) {
      return res
        .json({
          status: "error",
          requestId: request.requestId,
          message: "User Not Found",
        })
        .status(400);
    }

    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) {
      if (password.length < 12) {
        return res
          .json({
            status: "error",
            requestId: req.requestId,
            message: "Password under 12 characters not acceptable",
          })
          .status(400);
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.status(200).json({ message: "User updated successfully.", user });
  } catch (error) {
    return res.json({
      status: "error",
      requestId: req.requestId,
      message: error.message,
    });
  }
};
