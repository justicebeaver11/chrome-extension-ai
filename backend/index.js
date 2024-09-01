const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();

app.use(bodyParser.json());
app.use(cookieParser()); // Middleware to parse cookies

// Example session store - replace with your actual store
const sessionStore = {
  'valid_session_token_1': true,
  'valid_session_token_2': true,
};

// Function to validate session token against your session store or database
async function validateSessionToken(token) {
  // Simulate async database lookup
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(sessionStore[token] || false);
    }, 100);
  });
}

app.post('/chatgpt', async (req, res) => {
  const sessionToken = req.cookies.session_token; // Retrieve session token from cookies

  if (!sessionToken) {
    return res.status(401).json({ error: 'Not authenticated. No session token found.' });
  }

  const isValidToken = await validateSessionToken(sessionToken);

  if (!isValidToken) {
    return res.status(403).json({ error: 'Invalid session token' });
  }

  const { chatid, aiengine, message } = req.body;

  // Implement your logic to generate a response
  const chatbotResponse = `You said: ${message}. Here's a response from ${aiengine} with chatid ${chatid}!`;

  res.json({ reply: chatbotResponse });
});

// Replace with the actual port your server uses
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


