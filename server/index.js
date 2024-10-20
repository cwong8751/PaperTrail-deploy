import express from 'express';
import helmet from 'helmet'; //security
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
import { GetAccounts } from './api/GetAccounts.js';
dotenv.config();
const app = express();
app.use(express.json()); // To parse JSON request bodies
app.use(cors());
app.use(bodyParser.json())

// Set up helmet with custom CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"], // Allow content from self
      scriptSrc: ["'self'", "https://vercel.live"], // Allow scripts from self and Vercel
      // Add other directives as needed, e.g. imgSrc, styleSrc, etc.
    },
  },
}));

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

//Add transactions from receipts
// Add a transaction for the logged-in user
app.post('/add-receipt', async (req, res) => {
  console.log(req.body); // Log incoming request body
  const { username, transactionDate, transactionAmount } = req.body;

  // Ensure the required fields are provided
  if (!username || !transactionDate || !transactionAmount) {
    return res.status(400).json({ error: 'Username, transaction date, and transaction amount are required.' });
  }

  try {
    // Find the user by username
    const user = await usersCollection.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Create a new transaction object
    const newTransaction = {
      transactionDate: new Date(transactionDate), // Ensure it's a valid date
      transactionAmount: parseFloat(transactionAmount) // Ensure it's a valid float
  };

    // Push the transaction into the user's transactions array
    await usersCollection.updateOne({ username }, { $push: { transactions: newTransaction } });

    res.status(200).json({ message: 'Transaction added successfully.' });
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: 'Server error while adding transaction.' });
  }
});



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

  console.log("Logging in user with username:", username);  // Debug log
  
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

    // Save the username and token in the response
    res.json({ token, username: user.username, message: 'Login successful' });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

app.post('/getallreceipts', async (req, res) => {
  const { username } = req.body;

  // Debugging: Log the incoming data
  console.log("Getting all receipts for user with username:", username);

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const user = await usersCollection.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Username does not exist' });
    }

    // Return the transactions field (or whichever field holds the receipts)
    res.json({ receipts: user.transactions || [] });
  } catch (error) {
    console.error('Get all receipts error:', error);
    res.status(500).json({ error: 'Server error during get all receipts' });
  }
});

// Fetch all usernames
app.get('/get-usernames', async (req, res) => {
  try {
    const users = await usersCollection.find({}, { projection: { username: 1, _id: 0 } }).toArray();
    const usernames = users.map(user => user.username);
    res.status(200).json({ usernames });
  } catch (error) {
    console.error('Error fetching usernames:', error);
    res.status(500).json({ error: 'Server error while fetching usernames.' });
  }
});

app.get('/create-access-token', CreateAccessToken);
app.post('/add-customer', AddCustomer);
app.post('/generate-link', GenerateLink);
app.post('/get-transactions', GetTransactions);
app.post('/refresh-accounts', RefreshAccounts);
app.post('/get-accounts', GetAccounts);
