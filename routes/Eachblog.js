const { Router } = require("express");

const Blog = require("../models/blog");
const Comment = require("../models/comment");

const router = Router();

router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");
    return res.render("Eachblog", {
      user: req.user,
      blog,
      comments,
    });
  } catch (error) {
    // console.log(error);
  }
});

router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user.id,
  });
  return res.redirect(`/Eachblog/${req.params.blogId}`);
});

module.exports = router;
