const AdminMiddleware = (req, res, next) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "adminPassword") {
    req.session.user = { username: "admin" };
    next();
  } else {
    return res.status(401).json({
      status: "Error",
      requestId: req.requestId,
      message: "Authentication Failed",
    });
  }
};

const AuthCheckAdmin = (req, res, next) => {
  const { user } = req;
  console.log(req.user);
  if (user && user.username === "admin") next();
  else {
    return res.status(403).json({
      status: "Error",
      requestId: req.requestId,
      message: "Forbidden",
    });
  }
};

module.exports = { AdminMiddleware, AuthCheckAdmin };
