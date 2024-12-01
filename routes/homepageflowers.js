const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Route to get flowers list
router.get("/", (req, res) => {
  const flowersDataPath = path.join(__dirname, "../data/homepageflowers.json");

  // Read the flowers.json file
  fs.readFile(flowersDataPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading flowers.json file:", err);
      return res.status(500).send("Error loading flower data.");
    }

    try {
      const flowers = JSON.parse(data); // Parse the JSON
      console.log("Flowers loaded from JSON:", flowers); // Debugging log
      res.render("pages/flowers", { title: "Our Flowers", flowers });
    } catch (parseError) {
      console.error("Error parsing flowers.json:", parseError);
      res.status(500).send("Error processing flower data.");
    }
  });
});

// Debug route to verify flowers JSON
router.get("/debug", (req, res) => {
  const flowersDataPath = path.join(__dirname, "../data/homepageflowers.json");

  // Return raw JSON data for testing
  fs.readFile(flowersDataPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading flowers.json file:", err);
      return res.status(500).send("Error loading flower data.");
    }

    res.send(data); // Return raw JSON
  });
});

module.exports = router;
