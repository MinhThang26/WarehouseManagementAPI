const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const socketIO = require('socket.io');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

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

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const authRouter = require("./routers/authRouter");
const warehouseRouter = require("./routers/warehouseRouter");
const adminRouter = require("./routers/adminRouter");
const orderController = require("./routers/orderRouter");
const blogRouter = require("./routers/blogRouter");
const commentRouter = require("./routers/commentRouter");
const chatRouter = require("./routers/chatRouter");
const messageRouter = require("./routers/messageRouter");

app.use("/v1/auth", authRouter);
app.use("/v1/warehouse", warehouseRouter);
app.use("/v1/admin", adminRouter);
app.use("/v1/order", orderController);
app.use("/v1/blog", blogRouter);
app.use("/v1/blog/comment", commentRouter);
app.use("/v1/chat", chatRouter);
app.use("/v1/message", messageRouter);

module.exports = app;
