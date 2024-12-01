const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const router = express.Router();

// GET Signup Page
router.get("/signup", (req, res) => {
  console.log("GET /signup route hit");
  res.render("pages/signup", { title: "Sign Up" });
});

// POST Signup Functionality
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  console.log("Signup data received:", { username, password });

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log("Signup failed: Username already exists");
      return res.render("pages/signup", {
        title: "Sign Up",
        error: "Username already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);

    // Save user
    const newUser = new User({ username, password: hashedPassword });
    const savedUser = await newUser.save();
    console.log("User saved to database:", savedUser);

    // Save session and redirect
    req.session.user = { _id: savedUser._id, username: savedUser.username }; // Added _id to session
    console.log("Session after signup/login:", req.session.user);
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).send("Session error");
      }
      res.redirect("/");
    });
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).send("Error saving user");
  }
});

// GET Login Page
router.get("/login", (req, res) => {
  console.log("GET /login route hit");
  res.render("pages/login", { title: "Login" });
});

// POST Login Functionality
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("Login data received:", { username, password });

  try {
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      console.log("Login failed: User not found");
      return res.render("pages/login", {
        title: "Login",
        error: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Login failed: Invalid password");
      return res.render("pages/login", {
        title: "Login",
        error: "Invalid credentials",
      });
    }

    // Login success - Save session and redirect
    req.session.user = { _id: user._id, username: user.username }; // Added _id to session
    console.log("Session after signup/login:", req.session.user);

    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).send("Session error");
      }
      res.redirect("/");
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send("Error logging in");
  }
});

// Logout Functionality
router.get("/logout", (req, res) => {
  console.log("GET /logout route hit");
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).send("Error while logging out.");
    }
    res.redirect("/");
  });
});

module.exports = router;
