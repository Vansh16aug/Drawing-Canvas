const { Router } = require("express");

const Blog = require("../models/blog");
const Comment = require("../models/comment");

const router = Router();

router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({ blogId: req.params.id }).populate(
      "createdBy"
    );

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
  // console.log("User ID:", req.user._id);
  // console.log("Comment content:", req.body.content);
  // console.log("Blog ID:", req.params.blogId);
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/Eachblog/${req.params.blogId}`);
});

module.exports = router;
