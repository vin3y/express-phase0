const express = require("express");
const router = express.Router();

router.get("/user-list", (req, res) => {
  res
    .json({
      status: "success",
      message: "User list route",
    })
    .status(200);
});

router.post("/create-user", async (req, res) => {
  try {
  } catch (error) {
    res.status(400).json({ status: "error", reqId: req.requestId });
  }
});

module.exports = router;
