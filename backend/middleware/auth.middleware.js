const BlacklistModel = require("../model/blacklist.model");
const jwt = require("jsonwebtoken");
const UserModel = require("../model/user.model");

function auth(req, res, next) {
  const token = req.cookies.token;
  jwt.verify(token, "shlok", async (err, decoded) => {
    const blacklist = await BlacklistModel.findOne({ token });
    if (blacklist) {
      res.status(400).json({ msg: "Invalid Token! please login again." });
    } else {
      try {
        if (decoded) {
          // const user=await UserModel.findOne({_id:decoded.id});
          req.body.userID = decoded.id;
          next();
        }
      } catch (error) {
        res.status(400).json(error);
      }
    }
  });
}

module.exports = auth;
