const express = require("express");
const AuthenticateMiddleware = require("../middlewares/AuthenticateMiddleware");
const {
  fetchCollection,
  fetchProductDetail,
} = require("../controller/ExploreController");
const router = express.Router();

router.get("/all-collections", AuthenticateMiddleware, fetchCollection);
router.post("/product-detail", AuthenticateMiddleware, fetchProductDetail);

module.exports = router;
