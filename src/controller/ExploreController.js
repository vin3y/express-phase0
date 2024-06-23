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
         it.image_urls AS images
       FROM
         product p
       JOIN
         product_stock ps ON p.id = ps.product_id
       JOIN
         size s ON ps.size_id = s.id
       LEFT JOIN
         colors c ON ps.color_id = c.id
       LEFT JOIN
         images_table it ON p.id = it.product_id AND c.id = it.color_id
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

    // Initialize product details
    const productDetails = {
      product_id: result.rows[0].product_id,
      description: result.rows[0].description,
      price: result.rows[0].price,
      brand: result.rows[0].brand,
      year: result.rows[0].year,
      category: result.rows[0].category,
      gender: result.rows[0].gender,
      primary_image: result.rows[0].primary_image,
      colors: [],
    };

    const colorsMap = {};

    result.rows.forEach((row) => {
      const { color, size, size_id, stock, images } = row;

      if (!colorsMap[color]) {
        colorsMap[color] = {
          name: color,
          images: images || [], // Ensure images are handled as an array
          sizes: [],
        };
      }

      // Add size and stock for each color
      colorsMap[color].sizes.push({
        size,
        size_id,
        stock,
      });
    });

    // Convert colors map to array
    productDetails.colors = Object.values(colorsMap);

    return res.status(200).json({
      status: "success",
      requestId: req.requestId,
      data: productDetails,
    });
  } catch (error) {
    console.error("Error fetching product details :", error);
    return res.status(500).json({
      status: "error",
      requestId: req.requestId,
      message: "Internal server error",
    });
  }
};
