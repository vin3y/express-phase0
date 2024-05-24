const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/UsersModel");

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const checkUser = await User.findOne({
    $or: [{ username }, { email: username }],
  });
  if (!checkUser) {
    return res.status(401).json({
      status: "error",
      requestId: req.requestId,
      message: "Invalid Creds",
    });
  }

  const passwordMatch = await bcrypt.compare(password, checkUser.password);
  if (!passwordMatch) {
    return res.status(401).json({
      status: "error",
      requestId: req.requestId,
      message: "Invalid Password",
    });
  }
});

module.exports = router;
