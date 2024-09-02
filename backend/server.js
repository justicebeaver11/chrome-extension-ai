// const express = require('express');
// const cookieParser = require('cookie-parser');
// const axios = require('axios');
// const cors = require('cors');

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cookieParser());
// app.use(express.json());
// app.use(cors({
//     origin: 'chrome-extension://ghojhhdopbpkcmljeceeiggbpgojpadh', // Replace with your Chrome extension ID
//     credentials: true
// }));

// // Endpoint to handle chat requests
// app.post('/api/chat', async (req, res) => {
//     const { message } = req.body;

//     // Extract session token from cookies
//     const sessionToken = req.cookies.session_token;

//     if (!sessionToken) {
//         return res.status(401).json({ error: 'User not authenticated' });
//     }

//     try {
//         // Send the request to the /chatgpt endpoint
//         const response = await axios.post('https://app.ai4chat.co/chatgpt', {
//             message: message
//         }, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${sessionToken}`
//             },
//             withCredentials: true
//         });

//         // Forward the response back to the Chrome extension
//         res.json(response.data);
//     } catch (error) {
//         console.error('Error communicating with AI4Chat:', error.message);
//         res.status(500).json({ error: 'Error communicating with AI4Chat' });
//     }
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

const express = require('express');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: 'chrome-extension://ghojhhdopbpkcmljeceeiggbpgojpadh', // Replace with your Chrome extension ID
    credentials: true
}));

// Endpoint to handle chat requests
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    // Extract session token from cookies
    const sessionToken = req.cookies.session_token;

    if (!sessionToken) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        // Send the request to the /chatgpt endpoint
        const response = await axios.post('https://app.ai4chat.co/chatgpt', {
            message: message
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionToken}`
            },
            withCredentials: true
        });

        // Forward the response back to the Chrome extension
        res.json(response.data);
    } catch (error) {
        console.error('Error communicating with AI4Chat:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        res.status(500).json({ error: 'Error communicating with AI4Chat' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

