import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { CreateAccessToken } from './api/CreateAccessToken.js';
import { GenerateLink } from './api/GenerateLink.js';
import { AddCustomer } from './api/AddCustomer.js';
import { GetTransactions } from './api/GetTransactions.js';
import { RefreshAccounts } from './api/RefreshAccounts.js';
dotenv.config();
const app = express();
app.use(express.json()); // To parse JSON request bodies
app.use(cors());
app.use(bodyParser.json())

const {MongoClient} = require('mongodb');

const uri = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;


// Initialize MongoDB client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let usersCollection;

// Connect to MongoDB and start the server
async function connectToMongoAndStartServer() {
  try {
    await client.connect();
    console.log("MongoDB connected");
    // Initialize the users collection
    usersCollection = client.db('hackwashu2024').collection('Users'); // Replace 'mydatabase' with your actual database name

    // Start the server only after connecting to MongoDB
    const PORT = process.env.PORT || 8090;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process with failure if MongoDB connection fails
  }
}

connectToMongoAndStartServer();

//Register a new user
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Debugging: Log the incoming data
  console.log("Registering user with username:", username, "and password:", password);

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await usersCollection.insertOne({ username, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Debugging: Log the incoming data
  console.log("Logging in user with username:", username, "and password:", password);

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const user = await usersCollection.findOne({ username });
    if (!user) {
      console.log("Username does not exist");
      return res.status(400).json({ error: 'Username does not exist' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Protected route example (requires valid JWT)
app.get('/protected', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ message: 'Protected data accessed', user: decoded });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.get('/create-access-token', CreateAccessToken);
app.post('/add-customer', AddCustomer);
app.post('/generate-link', GenerateLink);
app.post('/get-transactions', GetTransactions);
app.post('/refresh-accounts', RefreshAccounts);