const express = require("express");
const PictureModel = require("../model/picture.model");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const auth = require("../middleware/auth.middleware");

const pictureRouter = express.Router();

pictureRouter.post("/", auth, upload.single("avatar"), async (req, res) => {
  try {
    // const {quore,photo:req.file.path,}
    const pic = new PictureModel(req.body);
    await pic.save();
    // console.log(req.file.path);
    res.status(200).json({ msg: "picture added successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

pictureRouter.get("/", auth, async (req, res) => {
  try {
    const { userID } = req.body;
    const picture = await PictureModel.find({ userID });
    res.status(200).json({ msg: "pictures", picture });
  } catch (error) {
    res.status(400).json(error);
  }
});

pictureRouter.get("/:pictureID", auth, async (req, res) => {
  try {
    const { pictureID } = req.params;
    const picture = await PictureModel.findOne({ _id: pictureID });
    res.status(200).json({ msg: "pictures", picture });
  } catch (error) {
    res.status(400).json(error);
  }
});

pictureRouter.patch("/:pictureID", auth, async (req, res) => {
  try {
    const { pictureID } = req.params;
    const picture = await PictureModel.findOne({ _id: pictureID });
    if (picture.userID === req.body.userID) {
      await PictureModel.findByIdAndUpdate({ _id: pictureID }, req.body);
      res.status(200).json({ msg: "updated picture successfully" });
    } else {
      res
        .status(400)
        .json({ msg: "You are not allowed to Update someone else picture" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

pictureRouter.delete("/:pictureID", auth, async (req, res) => {
  try {
    const { pictureID } = req.params;
    const picture = await PictureModel.findOne({ _id: pictureID });
    if (picture.userID === req.body.userID) {
      await PictureModel.findByIdAndDelete({ _id: pictureID });
      res.status(200).json({ msg: "Deleted picture successfully" });
    } else {
      res
        .status(400)
        .json({ msg: "You are not allowed to Delete someone else picture" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = pictureRouter;
