/*const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Route to get flowers list
router.get("/", (req, res) => {
  const flowersDataPath = path.join(__dirname, "../data/flowers.json");

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
  const flowersDataPath = path.join(__dirname, "../data/flowers.json");

  // Return raw JSON data for testing
  fs.readFile(flowersDataPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading flowers.json file:", err);
      return res.status(500).send("Error loading flower data.");
    }

    res.send(data); // Return raw JSON
  });
});

router.get("/:id", (req, res) => {
  const flowerId = req.params.id;
  const flowersDataPath = path.join(__dirname, "../data/flowers.json");

  fs.readFile(flowersDataPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading flowers.json file:", err);
      return res.status(500).send("Error loading flower data.");
    }

    try {
      const flowers = JSON.parse(data);
      const flower = flowers.find((f) => f._id === flowerId);
      

      if (!flower) {
        return res.status(404).send("Flower not found.");
      }

      res.render("pages/flower", { title: flower.name, flower });
    } catch (parseError) {
      console.error("Error parsing flowers.json:", parseError);
      res.status(500).send("Error processing flower data.");
    }
  });
});

module.exports = router;
*/

const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Route to get the flowers list
router.get("/", (req, res) => {
  const flowersDataPath = path.join(__dirname, "../data/flowers.json");

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
  const flowersDataPath = path.join(__dirname, "../data/flowers.json");

  // Return raw JSON data for testing
  fs.readFile(flowersDataPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading flowers.json file:", err);
      return res.status(500).send("Error loading flower data.");
    }

    res.send(data); // Return raw JSON
  });
});

// Route for individual flower page
router.get("/:id", (req, res) => {
  const flowerId = req.params.id;
  const flowersDataPath = path.join(__dirname, "../data/flowers.json");
  const homepageFlowersDataPath = path.join(__dirname, "../data/homepageflowers.json");

  // Read both the flowers.json and homepageflowers.json files
  fs.readFile(flowersDataPath, "utf8", (err, flowersData) => {
    if (err) {
      console.error("Error reading flowers.json:", err);
      return res.status(500).send("Error loading flower data.");
    }

    fs.readFile(homepageFlowersDataPath, "utf8", (homepageErr, homepageData) => {
      if (homepageErr) {
        console.error("Error reading homepageflowers.json:", homepageErr);
        return res.status(500).send("Error loading homepage flowers data.");
      }

      try {
        const flowers = JSON.parse(flowersData);
        const homepageFlowers = JSON.parse(homepageData);

        // Find the flower by its ID
        const flower = flowers.find(f => f._id === flowerId);
        if (!flower) {
          return res.status(404).send("Flower not found.");
        }

        // Get related flowers (exclude the current flower and take the first 4)
        const relatedFlowers = homepageFlowers.filter(f => f._id !== flowerId).slice(0, 3);

        // Send the data to the template
        res.render("pages/flower", {
          title: flower.name,
          flower,
          relatedFlowers
        });
      } catch (parseError) {
        console.error("Error parsing flower data:", parseError);
        res.status(500).send("Error processing flower data.");
      }
    });
  });
});

module.exports = router;
