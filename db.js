const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DBUSER,
  host: process.env.DBHOST,
  database: process.env.DBDATABASE,
  password: process.env.DBPASSWORD,
  port: process.env.DBPORT,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
