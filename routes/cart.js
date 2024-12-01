const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Cart = require("../models/cart");
const Flower = require("../models/Flower");

// Middleware to ensure the user is logged in
const ensureAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect("/users/login"); // Redirect to login if not authenticated
};

// Add Flower to Cart
router.post("/add", ensureAuthenticated, async (req, res) => {
  const flowerId = req.body.flowerId;
  const userId = req.session.user._id; // Assuming the session stores the user ID

  try {
    // Check if cart already exists for the user
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      // Create new cart if one does not exist
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if the flower is already in the cart
    const flowerExistsInCart = cart.items.some(
      (item) => item.flower.toString() === flowerId
      
    );

    if (flowerExistsInCart) {
      // If flower is already in cart, increment the quantity
      cart.items = cart.items.map((item) => {
        if (item.flower.toString() === flowerId) {
          item.quantity += 1;
        }
        return item;
      });

    } else {
      // If flower is not in cart, add new item
      const flower = await Flower.findById(flowerId);
      if (flower) {
        cart.items.push({ flower: flowerId, quantity: 1 });
      }
    }
    // Save the cart
    await cart.save();

    // Redirect to the cart page to show updated cart
    res.redirect("/flowers");
  } catch (error) {
    console.error("Error adding flower to cart:", error);
    res.status(500).send("Error adding flower to cart.");
  }
});

// View Cart (GET)
router.get("/", ensureAuthenticated, async (req, res) => {
  const userId = req.session.user._id;

  try {
    // Fetch the cart for the logged-in user
    const cart = await Cart.findOne({ user: userId }).populate("items.flower");

    if (cart) {
      res.render("pages/cart", {
        title: "Your Cart",
        cart: cart,
        loggedIn: true,
        username: req.session.user.username,
      });
    } else {
      res.render("pages/cart", {
        title: "Your Cart",
        cart: null,
        loggedIn: true,
        username: req.session.user.username,
      });
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).send("Error retrieving cart.");
  }
});

// Remove Item from Cart
router.post("/remove", ensureAuthenticated, async (req, res) => {
  const { flowerId } = req.body;
  const userId = req.session.user._id;

  try {
    // Find the cart and remove the item
    const cart = await Cart.findOne({ user: userId });

    if (cart) {
      cart.items = cart.items.filter(
        (item) => item.flower.toString() !== flowerId
      );
      await cart.save();
      res.redirect("/cart");
    } else {
      res.status(404).send("Cart not found.");
    }
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).send("Error removing item from cart.");
  }
});

// Update Quantity in Cart
router.post("/update", ensureAuthenticated, async (req, res) => {
  const { flowerId, quantity } = req.body;
  const userId = req.session.user._id;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.flower.toString() === flowerId
      );

      if (itemIndex !== -1) {
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        res.redirect("/cart");
      } else {
        res.status(404).send("Item not found in cart.");
      }
    } else {
      res.status(404).send("Cart not found.");
    }
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).send("Error updating cart.");
  }
});

module.exports = router;
