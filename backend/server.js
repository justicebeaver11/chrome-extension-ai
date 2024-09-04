

const express = require('express');
const axios = require('axios');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());

// Endpoint to handle requests from the Chrome extension
app.post('/chatgpt', async (req, res) => {
    try {
        const { chatid, aiengine, conversation } = req.body;

        // Get session_token from cookies
        const sessionToken = req.cookies.session_token;

        if (!sessionToken) {
            console.log('No session token found in cookies');
            return res.status(401).json({ error: 'Unauthorized: No session token provided' });
        }

        console.log('Session Token:', sessionToken);
        console.log('Request Body:', req.body);

        // Forward the request to the /chatgpt endpoint on your site
        const response = await axios.post(
            'https://app.ai4chat.co/chatgpt',
            {
                chatid,
                aiengine,
                conversation,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `session_token=${sessionToken}`
                }
            }
        );

        // Send the response back to the extension
        res.json(response.data);

    } catch (error) {
        console.error('Error in /chatgpt request:', error.message);
        if (error.response) {
            // Log detailed server response information
            console.error('Server responded with:', error.response.status);
            console.error('Response body:', error.response.data);
            res.status(error.response.status).json({ error: error.response.data });
        } else if (error.request) {
            // Log that no response was received
            console.error('No response received:', error.request);
            res.status(500).json({ error: 'No response received from server' });
        } else {
            // Log error during request setup
            console.error('Error setting up request:', error.message);
            res.status(500).json({ error: 'Error setting up request' });
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});










