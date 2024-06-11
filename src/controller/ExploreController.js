const User = require("../models/UsersModel");
const db = require("../../db");

exports.fetchCollection = async (req, res) => {
  if (req.user) {
    try {
      const query = `
        SELECT DISTINCT ON (p.id)
                  p.id AS product_id,
                  p.description,
                  p.price,
                  p.brand,
                  p.year,
                  p.category,
                  p.gender
              FROM
                  product p;
        `;
      const result = await db.query(query);
      return res.status(200).json({
        status: "success",
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
        error: "Unauthorized",
      })
      .status(403);
  }
};

exports.fetchProductDetail = async (req, res) => {
  const { productId } = req.body;

  try {
    // const productIdCheckQuery =
    //   "SELECT EXISTS(SELECT 1 FROM product WHERE id = $1)";
    // const queryResult = await db.query(productIdCheckQuery, [productId]);
    // const productExsists = queryResult[0].rows;

    // if (!productExsists) {
    //   return res.json({
    //     status: "error",
    //     requestId: req.requestId,
    //     message: "product doesnt exsist",
    //   });
    // }

    const query = `
      SELECT
          p.id AS product_id,
          p.description,
          p.price,
          p.brand,
          p.year,
          p.category,
          p.gender,
          s.size,
          c.name AS color,
          ps.stock
      FROM
          product p
      JOIN
          product_size ps ON p.id = ps.product_id
      JOIN
          size s ON ps.size_id = s.id
      LEFT JOIN
          colors c ON ps.color_id = c.id
      WHERE
          p.id = $1;
        `;

    const result = await db.query(query, [productId]);
    return res
      .json({
        status: "success",
        requestId: req.requestId,
        data: result.rows,
      })
      .status(200);
  } catch (error) {
    console.error("Error fetching product details :", error);
    return res
      .json({
        status: "error",
        requestId: req.requestId,
        message: "Internal server error",
      })
      .status(500);
  }
};
