const express = require("express");
const UserModel = require("../model/user.model");
const BlacklistModel = require("../model/blacklist.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  const { username, email, password, city, age, gender } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ msg: "User already exists" });
    } else {
      const hashPass = await bcrypt.hash(password, 5);
      const user = new UserModel({ ...req.body, password: hashPass });
      await user.save();
      res.status(200).json({ msg: "User signup successfully" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        const token = jwt.sign({ id: user._id }, "shlok", {
          expiresIn: "7d",
        });
        res.cookie("token", token);
        res.status(200).json({ msg: "Login Success", token });
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

userRouter.get("/logout", async (req, res) => {
  const token = req.cookies.token;
  try {
    const logout = new BlacklistModel({ token });
    await logout.save();
    res.status(200).json({ msg: "Logout Success" });
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = userRouter;
