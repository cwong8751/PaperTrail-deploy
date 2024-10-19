// Use CommonJS require instead of import
// const OpenAI = require("openai");
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser')
// Initialize OpenAI
// const openai = new OpenAI();

dotenv.config();

const app = express();
app.use(express.json()); // To parse JSON request bodies
app.use(cors());
app.use(bodyParser.json())
// MongoDB connection
const uri = process.env.MONGO_URI; 
// JWT secret key (store in .env)
// async function getHaiku() {
//   try {
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [
//         { role: "user", content: "write a haiku about ai" }
//       ]
//     });
//     console.log("Generated Haiku: ", completion.choices[0].message.content);
//   } catch (error) {
//     console.error("Error with OpenAI: ", error);
//   }
// }

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the MongoDB server
    await client.connect();
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // Call OpenAI to generate a haiku
    // await getHaiku();
  } catch (error) {
    console.error("MongoDB connection error: ", error);
  } finally {
    // Ensure client closes after the operations
    await client.close();
  }
}

run().catch(console.dir);

app.post('/ask-ai', async (req, res) => {
    const { prompt } = req.body; // question from backend 
    console.log("this is the prompt",prompt)
    try {
        const response = await axios.post(
            'https://api.sambanova.ai/v1/chat/completions',
            {
                model: 'Meta-Llama-3.1-405B-Instruct',
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.SAMBANOVA_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        // get response from AI
        const aiResponse = response.data.choices.map((choice) => choice.message.content).join('');
        console.log("ai response", aiResponse)
        res.json({ response: aiResponse });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Something went wrong!' });
    }
});

app.get('/api/location', async (req, res) => {
    const { latitude, longitude } = req.query;
    console.log(latitude,longitude)
    // Input validation
    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const APIkey = process.env.OPENCAGE_API_KEY; //  OpenCage API key from .env
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${APIkey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Location Data")
        console.log(data)
        if (data.status.code === 200) {
            res.json({ location: data.results[0].formatted });
        } else {
            res.status(500).json({ error: 'Failed to get location info' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while sending location data' });
    }
});
const JWT_SECRET = process.env.JWT_SECRET;

// Connect to MongoDB
let usersCollection;
client.connect((err) => {
    if (err) throw err;
    console.log('MongoDB connected');
    usersCollection = client.db('mydatabase').collection('users'); // Replace 'mydatabase' with your database name
});

// API: Register a new user
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
        return res.status(400).json({ error: 'Username, and password are required' });
    }

    try {
        // Check if user already exists
        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to database
        await usersCollection.insertOne({
            username,
            password: hashedPassword, // Store hashed password
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// API: Login a user
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Check if user exists
        const user = await usersCollection.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        res.json({ token, message: 'Login successful' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Protected route example (requires valid JWT)
app.get('/protected', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from header

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

// Start the server
const PORT = process.env.PORT || 8090;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});