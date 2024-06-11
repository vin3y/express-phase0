const express = require("express");
const AuthenticateMiddleware = require("../middlewares/AuthenticateMiddleware");

const router = express.Router();

router.post("/test-get", AuthenticateMiddleware, (req, res) => {
  console.log(req);
  res.status(200).json({ status: "successs" });
});

module.exports = router;
