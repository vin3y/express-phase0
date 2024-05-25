const express = require("express");
const userRoute = require("./src/routes/UserRoutes");
const authRoute = require("./src/routes/AuthenticationRoutes");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const reqId = require("./src/utils/requestId");
const loggerMiddleware = require("./src/middlewares/LoggerMiddleware");

const app = express();
dotenv.config();

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(reqId);
app.use(loggerMiddleware);

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongodb was connected");
  })
  .catch((err) => {
    console.log("Mongodb was not connected", err);
  });

mongoose.connection.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
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

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
