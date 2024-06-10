const express = require("express");
const userRoute = require("./src/routes/UserRoutes");
const authRoute = require("./src/routes/AuthenticationRoutes");
const adminRoute = require("./src/routes/AdminRoutes");
const PORT = process.env.PORT || 4000;
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const reqId = require("./src/utils/requestId");
const loggerMiddleware = require("./src/middlewares/LoggerMiddleware");

const app = express();
dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

// console.log(MONGO_URL);

app.use(express.json());
app.use(loggerMiddleware);
app.use(express.urlencoded({ extended: false }));
app.use(reqId);

mongoose
  .connect(MONGO_URL, {
    // useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongodb was connected");
  })
  .catch((err) => {
    console.log("Mongodb was not connected", err);
  });

app.get("/", (req, res) => {
  res
    .json({
      status: "success",
      message: "home route",
    })
    .status(200);
});

app.use("/users", userRoute);
app.use("/auth", authRoute);
app.use("/admin", adminRoute);

app.all("*", (req, res) => {
  return res.json({ status: "error", message: "not found" }).status(404);
});

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
