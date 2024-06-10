const express = require("express");
const router = express.Router();
const AMiddleware = require("../middlewares/AdminMiddleware");

router.post("/admin-login", AMiddleware.AdminMiddleware, (req, res) => {
  return res.json({
    status: "sucess",
    requestId: req.requestId,
    message: "Login Successfull",
    user: req.user,
  });
});

router.get(
  "/test-admin",
  AMiddleware.AdminMiddleware,
  AMiddleware.AuthCheckAdmin,
  (req, res) => {
    returnres
      .json({
        status: "success",
        requestId: req.requestId,
        message: "Admin test route success",
      })
      .status(200);
  },
);

module.exports = router;
