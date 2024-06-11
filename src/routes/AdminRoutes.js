const express = require("express");
const router = express.Router();
const AMiddleware = require("../middlewares/AdminMiddleware");
const session = require("express-session");
require("dotenv").config();

router.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 60 * 60 * 100,
    },
  }),
);
router.post("/admin-login", AMiddleware.AdminMiddleware, (req, res) => {
  req.session.user = req.user;
  return res.json({
    status: "sucess",
    requestId: req.requestId,
    message: "Login Successfull",
    user: req.user,
  });
});

router.get("/test-admin", AMiddleware.AuthCheckAdmin, (req, res) => {
  if (req.session && req.session.user) {
    return res.json({
      status: "success",
      requestId: req.requestId,
      message: "Admin test route success",
    });
  } else {
    return res.status(401).json({
      status: "error",
      requestId: req.requestId,
      message: "Unauthorized. Please log in.",
    });
  }
});

module.exports = router;
