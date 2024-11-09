const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const db = admin.firestore();
const auth = admin.auth();

// Endpoint to handle admin sign-up
router.post('/', async (req, res) => {
  const { email, password, name, mobile, adminKey } = req.body;

  // Validate the admin key
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ message: 'Invalid admin key' });
  }

  try {
    // Create the user
    const userRecord = await auth.createUser({
      email,
      password,
    });

    // Save user details in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email,
      name,
      mobile,
      isAdmin: true,
    });

    res.status(201).json({ message: 'Admin user created successfully', uid: userRecord.uid });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
