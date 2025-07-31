const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.MODE === 'test' ? process.env.STRIPE_SECRET_KEY_TEST : process.env.STRIPE_SECRET_KEY_LIVE);
const { createUser } = require('../services/userService'); // Ensure you have the createUser function properly imported

router.get('/session/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const session = await stripe.checkout.sessions.retrieve(id, {
      expand: ['customer'],
    });

    const customer = await stripe.customers.retrieve(session.customer);

    const token = await createUser(customer.email, customer.name); // Create user in your database and get token

    res.json({ token });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
