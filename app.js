require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcrypt");
const User = require("./models/UserModel");

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.db_connection, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Routes
app.get("/", (req, res) => {
  res.render("welcome"); // render the welcome page
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    password: hashedPassword,
  });

  await user.save();

  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login");
});

/* When a user tries to log in (via HTTP POST to "/login"), the back end will check if the entered username exists in the database (line 56). If the username exists, it compares the provided password with the hashed password stored in the database line 58. If the passwords match, the user's session is initialized with their user ID and username using express-session (lines 59 and 60). Lastly, they are redirected to the "/dashboard." In line 62. */
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && (await bcrypt.compare(password, user.password))) {
    req.session.userId = user._id;
    req.session.username = user.username;

    return res.redirect("/dashboard");
  }

  res.redirect("/login");
});

/* To access the "/dashboard,", the code checks if the user has an active session by verifying the presence of a user ID. If not, it redirects them to the login page (line 70). If there's an active session, the "dashboard" template is rendered, showing the user's username (line 73). */
app.get("/dashboard", (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  res.render("dashboard", {
    username: req.session.username,
  });
});

const server = app.listen(port, () => {
  console.log("Server listening");
  mongoose.connect(process.env.db_connection).then(() => {
    console.log("Database Connected");
  });
});
