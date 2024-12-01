const express = require('express');
const router = express.Router();

// Route to display the Contact Us page
router.get('/', (req, res) => {
  res.render('pages/contact', {
    address: '123 Flower Lane, Bloom City, FL 12345',
    phone: '+1 234 567 890',
    email: 'support@floralflair.com',
  });
});

// Route to handle form submissions
router.post('/submit', (req, res) => {
  const { name, email, message } = req.body;

  // Handle form submission logic (e.g., save to DB, send email, etc.)
  console.log(`Message received from ${name} (${email}): ${message}`);

  // Send a response or redirect
  res.redirect('/contact');
});

module.exports = router;
