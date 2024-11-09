const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const dotenv = require('dotenv');
const cors = require('cors');
const serviceAccount = require('./PrivateKey.json');

dotenv.config();

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();
const app = express();

app.use(bodyParser.json());
app.use(cors()); // Add CORS middleware

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Middleware for admin key validation
function validateAdminKey(req, res, next) {
  const { adminKey } = req.body;
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ message: 'Invalid admin key' });
  }
  next();
}

// Endpoint to create a new order
app.post('/orders', async (req, res) => {
  try {
    const order = req.body;
    if (!order) {
      return res.status(400).json({ message: 'Order data is required' });
    }
    const docRef = await db.collection('orders').add(order);
    res.status(200).send({ id: docRef.id });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Endpoint to get all orders
app.get('/orders', async (req, res) => {
  try {
    const orders = [];
    const snapshot = await db.collection('orders').get();
    snapshot.forEach(doc => orders.push({ id: doc.id, ...doc.data() }));
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Endpoint to get a specific order by ID
app.get('/orders/:id', async (req, res) => {
  try {
    const doc = await db.collection('orders').doc(req.params.id).get();
    if (!doc.exists) {
      res.status(404).send('Order not found');
    } else {
      res.status(200).send({ id: doc.id, ...doc.data() });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Endpoint to update order status (e.g., return, track)
app.patch('/orders/:id', async (req, res) => {
  try {
    const orderUpdates = req.body;
    if (!orderUpdates) {
      return res.status(400).json({ message: 'Order updates are required' });
    }
    await db.collection('orders').doc(req.params.id).update(orderUpdates);
    res.status(200).send('Order updated successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Endpoint to delete (cancel) an order
app.delete('/orders/:id', async (req, res) => {
  try {
    await db.collection('orders').doc(req.params.id).delete();
    res.status(200).send('Order deleted successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Endpoint to "buy again" (recreate an order with the same details)
app.post('/orders/:id/buy-again', async (req, res) => {
  try {
    const doc = await db.collection('orders').doc(req.params.id).get();
    if (!doc.exists) {
      res.status(404).send('Order not found');
    } else {
      const orderData = doc.data();
      const newDocRef = await db.collection('orders').add(orderData);
      res.status(200).send({ id: newDocRef.id });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Endpoint to handle admin sign-up
app.post('/signup', validateAdminKey, async (req, res) => {
  const { email, password, name, mobile } = req.body;

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
    res.status(500).json({ message: error.message });
  }
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
