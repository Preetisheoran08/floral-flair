const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Cart Schema
const CartSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
    required: true, // Ensures that userId is provided
  },
  items: [
    {
      flower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Flower", // Reference to the Flower model
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
