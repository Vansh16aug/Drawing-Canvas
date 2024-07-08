const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const cloudinary = require("../services/cloudinary");
const Blog = require("../models/blog");

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(req.file.path, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });

    const blog = await Blog.create({
      body,
      title,
      createdBy: req.user.id,
      coverImageURL: result.secure_url,
    });

    res.redirect(`/Eachblog/${blog._id}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error uploading image",
    });
  }
});

module.exports = router;