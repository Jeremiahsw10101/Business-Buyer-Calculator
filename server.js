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


app.post('/ask-augmented-openai', async (req, res) => {
    const { query, results } = req.body;

    const augmentedQuery = `
        You are an AI assistant integrated into a financial analysis tool designed to help potential investors 
        evaluate businesses for purchase and decide if they want to purchase it or not. 
        Your main goal is to assess the Return on Investment (ROI) that the investor can expect, 
        focusing specifically on the cash flow to their pockets and their personal contribution and loan payment costs.
        
        This is the financial data about the business:
        "${results}"
        
        This is the user question:
        "${query}"

      
        If the user question is related to the business, then use these guidelines to provide a helpful response.

        The Guidelines:
        - Dont mention the busines unless the user's question is directly related to it.
        - Analyze financial data to offer insights on if the business buyer should buy the potential business.
        - Evaluate if the business cash flow adequately covers loan payments; suggest it's a good investment if so.
        - Advise against the acquisition if monthly loan payments exceed monthly cash flow.
        - Suggest financial adjustments (like changing loan terms) to enhance profitability when needed.
        
        Respond with actionable insights, preferably in bullet points for clarity. 

        if the user question is this " " respond with this:
        
        "I'm an AI assistant here to help you with any questions you may have. Feel free to ask anything you need assistance with on your decision to buy this business!"
        
        if the user question is something not related to the business, then just provide a general response without anything that i told you so far in this prompt.
    `;
    console.log('augmentedQuery: \n\n', augmentedQuery);

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "system", content: augmentedQuery }]
            })
        });

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
            res.send(data.choices[0].message.content);
        } else {
            res.status(500).send('Unexpected response structure from OpenAI API');
        }
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