const db = require("../db");

const createProductTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS product (
      id SERIAL PRIMARY KEY,
      description TEXT NOT NULL,
      price NUMERIC(10, 2) NOT NULL,
      images TEXT[],
      brand TEXT NOT NULL,
      year INTEGER NOT NULL,
      category TEXT NOT NULL
    );
    `;
  try {
    await db.query(query);
    console.log("Product table created");
  } catch (err) {
    console.log("cannot be created");
  }
};

createProductTable();
