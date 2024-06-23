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
                  p.primary_image,
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
    const query = `
         SELECT
             p.id AS product_id,
             p.description,
             p.price,
             p.brand,
             p.year,
             p.category,
             p.gender,
             p.primary_image,
             s.id AS size_id,
             s.size,
             ps.stock,
             c.name AS color,
             c.images
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

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        requestId: req.requestId,
        message: "Product not found",
      });
    }

    // Initialize the product details object
    const productDetails = {
      product_id: result.rows[0].product_id,
      description: result.rows[0].description,
      price: result.rows[0].price,
      brand: result.rows[0].brand,
      year: result.rows[0].year,
      category: result.rows[0].category,
      gender: result.rows[0].gender,
      primary_image: result.rows[0].primary_image,
      sizes: [],
      colors: [],
    };

    const sizesMap = {};
    const colorsMap = {};

    result.rows.forEach((row) => {
      // Handle sizes and stocks
      if (!sizesMap[row.size]) {
        sizesMap[row.size] = { size_id: row.size_id, stock: row.stock };
      } else {
        sizesMap[row.size].stock += row.stock;
      }

      // Handle colors and images
      if (!colorsMap[row.color]) {
        colorsMap[row.color] = { name: row.color, images: row.images || [] };
      }
    });

    // Convert maps to arrays for the final response
    productDetails.sizes = Object.keys(sizesMap).map((size) => ({
      size,
      size_id: sizesMap[size].size_id,
      stock: sizesMap[size].stock,
    }));

    productDetails.colors = Object.keys(colorsMap).map((color) => ({
      name: colorsMap[color].name,
      images: colorsMap[color].images,
    }));

    return res.status(200).json({
      status: "success",
      requestId: req.requestId,
      data: productDetails,
    });
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
