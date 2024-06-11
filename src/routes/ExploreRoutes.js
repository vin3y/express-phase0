const express = require("express");
const AuthenticateMiddleware = require("../middlewares/AuthenticateMiddleware");
const db = require("../../db");

const router = express.Router();

router.get("/all-collections", AuthenticateMiddleware, async (req, res) => {
  if (req.user) {
    try {
      const query = `
              SELECT
                p.id AS product_id,
                p.description,
                p.price,
                p.images,
                p.brand,
                p.year,
                p.category,
                p.gender,
                s.size,
                ps.stock
              FROM
                product p
              JOIN
                product_size ps ON p.id = ps.product_id
              JOIN
                size s ON ps.size_id = s.id;
            `;
      const result = await db.query(query);
      return res.status(200).json({
        status: "sucess",
        requestId: req.requestId,
        data: result.rows,
      });
    } catch (error) {
      console.error("Error fetching query", error);
      return res
        .json({
          status: "error",
          requestId: req.requestId,
          error: "Internal server error",
        })
        .status(500);
    }
  } else {
    return res
      .json({
        status: "error",
        requestId: req.requestId,
        error: "UnAuthorized",
      })
      .status(401);
  }
});
module.exports = router;
