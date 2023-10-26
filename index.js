const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(morgan("common"));
app.use(express.json());
require("dotenv").config({ path: __dirname + "/.env" });
const port = process.env.PORT;

var dbConn = require("./config/databaseConfig");
mongoose.connection.once("open", () => {
  console.log("Connect mongodb");
  app.listen(port, () => {
    console.log("server api port " + port);
    setInterval(function () {
      console.log("server api port " + port);
    }, 300000);
  });
});

const authRouter = require("./routers/authRouter");
const warehouseRouter = require("./routers/warehouseRouter");
const adminController = require("./routers/adminRouter");

app.use("/v1/auth", authRouter);
app.use("/v1/warehouse", warehouseRouter);
app.use("/v1/admin", adminController);

module.exports = app;
