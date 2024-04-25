// Allowing the use of .env files to add in API keys vs making them publically available and posting them to github
import dotenv from 'dotenv';
dotenv.config();

// Importing modules using ESM syntax
import express from 'express';
import fetch from 'node-fetch';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';


// added this apikey variable setup here
const apiKey = process.env.OPENAI_API_KEY;

const app = express();
app.use(express.json());

// Define __dirname in ESM
const __dirname = dirname(fileURLToPath(import.meta.url));1

// Serve static files
app.use(express.static(join(__dirname, 'public')));


// AI request handling endpoint
app.post('/ask-openai', async (req, res) => {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: req.body.prompt }]
            })
        });

        //removing this for the test:
        //const data = await response.json();
        //res.send(data);
        // end of what is removed
        const data = await response.json();
        console.log(data);  // Log the response data for debugging
        
        if (data.choices && data.choices.length > 0) {
            res.send(data.choices[0].message.content);
        } else {
            res.status(500).send('Unexpected response structure from OpenAI API');
        }
        //end of what is being added
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred on the server.');
    }
});



// Start the server
// const PORT = 3000;
// app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});