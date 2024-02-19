const express = require("express");
const connection = require("./config/db");
const userRouter = require("./routes/user.route");
var cookieParser = require("cookie-parser");
const pictureRouter = require("./routes/picture.route");
var cors = require("cors");
require("dotenv").config();
const app = express();

app.use(express.json(), cookieParser(), cors());
app.use("/users", userRouter);
app.use("/pictures", pictureRouter);
app.use("/", (req, res) => {
  res.json({ msg: "The home route" });
});

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("server listening on 4500 and db is connected");
  } catch (error) {
    console.log(error);
  }
});
