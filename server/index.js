// Use CommonJS require instead of import
const OpenAI = require("openai");
const { MongoClient, ServerApiVersion } = require('mongodb');

// Initialize OpenAI
const openai = new OpenAI();

// Replace with your actual database password
const uri = "mongodb+srv://scarlettp:1LuvHackWashu!@database.3u9hz.mongodb.net/?retryWrites=true&w=majority&appName=database";

async function getHaiku() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "user", content: "write a haiku about ai" }
      ]
    });
    console.log("Generated Haiku: ", completion.choices[0].message.content);
  } catch (error) {
    console.error("Error with OpenAI: ", error);
  }
}

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
    await getHaiku();
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

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
