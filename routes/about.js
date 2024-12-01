const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("pages/about", {
    title: "About Us",
    loggedIn: req.session?.user ? true : false,
    username: req.session?.user?.username || null,
  });
});

module.exports = router;