
const mongoose = require("mongoose");

const flowerSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
});

module.exports = mongoose.model("Flower", flowerSchema);
