const User = require("../models/UsersModel");
const generateToken = require("../utils/tokenCreator");

exports.loginController = async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({
      status: "error",
      requestId: req.requestId,
      error: "All fields are mandatory",
    });
  }

  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: "error",
        requestId: req.requestId,
        message: "Check password or username/email",
      });
    }
    const token = generateToken(user);
    return res.status(200).json({
      status: "success",
      token,
      user: { firstname: user.firstname, email: user.email },
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      requestId: req.requestId,
      error: error.message,
    });
  }
};

exports.createUserController = async (req, res) => {
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
  try {
    const exsistingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (exsistingUser) {
      return res.json({
        status: "error",
        requestId: req.requestId,
        message: "User already exsisiting",
      });
    }

    const newUser = new User({
      firstname,
      lastname,
      username,
      email,
      password,
    });
    await User.save(newUser);
    const token = generateToken(newUser);
    res.status(201).json({
      status: "success",
      token,
      user: { id: newUser._id, firstname, email },
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      requestId: req.requestId,
      error: error.message,
    });
  }
};
