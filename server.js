const express = require("express");
const colors = require("colors");
const mongoose = require("mongoose");
const HttpError = require("./helper/HttpError");
const userRoutes = require("./routes/userRoutes");
const conRoutes = require("./routes/conRoutes");
const msgRoutes = require("./routes/msgRoutes");
require("dotenv").config();

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE"
  );

  next();
});

mongoose.connect(process.env.MONGO_URL);
const db = mongoose.connection;
db.once("error", (err) => console.log(err));
db.on("open", () => {
  console.log("database connected");
});

app.use("/api/user", userRoutes);
app.use("/api/con", conRoutes);
app.use("/api/message", msgRoutes);

app.use((req, res, next) => {
  const errors = new HttpError("no routes found for this path  ", 404);
  return next(errors);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "unknown error occured" });
});

const server = app.listen(process.env.PORT || 5000, () => {
  console.log("server running".yellow.bold);
  const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    console.log("client connected");
  });
  app.set("name", io);
});
