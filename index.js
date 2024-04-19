require("dotenv").config();

const nodemailer = require("nodemailer");
const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const EachblogRoute = require("./routes/Eachblog");

const Blog = require("./models/blog");

const cookieParser = require("cookie-parser");

const { checkForAuthenticationCookie } = require("./middlewares/auth");
const { text } = require("body-parser");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log(`Database is connected`);
  })
  .catch((err) => {
    console.error(`Database connection error: ${err}`);
  });

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use("/user", userRoute);
app.use("/blog", blogRoute);
app.use("/Eachblog", EachblogRoute);

app.get("/", (req, res) => {
  res.render("home", {
    user: req.user,
  });
});

app.get("/blog", async (req, res) => {
  const allBlogs = await Blog.find({}).sort({ createdAt: -1 }).populate("createdBy");
  res.render("blog", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.get("/draw", (req, res) => {
  return res.render("main", {
    user: req.user,
  });
});

//mailing

app.post("/sendmail", (req, res) => {
  console.log(req.body);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
    tls: {
      rejectUnAuthorized: false,
    },
  });
  
  const mailOptions = {
    from: req.body.email,
    to: process.env.EMAIL,
    subject: `Message from ${req.body.email}:`,
    text: req.body.message,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.render("error");
    } else {
      console.log("Email sent: " + info.response);
      res.render("success");
    }
  });
});

app.listen(PORT, () => {
  console.log(`server connected at http://localhost:${PORT}`);
});
