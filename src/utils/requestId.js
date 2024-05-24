const { v4: uuidv4 } = require("uuid");

const requestIdMiddleWare = (req, res, next) => {
  req.requestId = uuidv4();
  next();
};

module.exports = requestIdMiddleWare;
