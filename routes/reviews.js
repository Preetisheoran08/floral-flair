const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// Display all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.render("pages/reviews", { title: "Customer Reviews", reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).send("Error fetching reviews.");
  }
});

// Render form to add a new review
router.get("/new", (req, res) => {
  res.render("pages/add-review", { title: "Add Review" });
});

// Add a new review
router.post("/", async (req, res) => {
  const { name, email, rating, comment } = req.body;

  try {
    const newReview = new Review({ name, email, rating, comment });
    await newReview.save();
    res.redirect("/reviews");
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).send("Error adding review.");
  }
});

// Delete a review
router.post("/delete/:id", async (req, res) => {
  const reviewId = req.params.id;

  try {
    await Review.findByIdAndDelete(reviewId);
    res.redirect("/reviews");
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).send("Error deleting review.");
  }
});

module.exports = router;
