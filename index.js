const express = require('express');
const axios = require('axios');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 3000;
const token = process.env.TELEGRAM_TOKEN;
const apiUrl = `https://api.telegram.org/bot${token}/sendMessage`;

let messages = new Set();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Rate limiter to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);

app.post('/webhook', async (req, res) => {
  const { message } = req.body;
  if (message && message.text) {
    const chatId = message.chat.id;
    const text = message.text;

    if (!messages.has(text)) {
      messages.add(text);

      // Echo the received message back to the user
      try {
        await axios.post(apiUrl, {
          chat_id: chatId,
          text: `You said: ${text}`
        });
        res.status(200).send('Message sent');
      } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send('Error sending message');
      }
    } else {
      res.status(200).send('Message already processed');
    }
  } else {
    res.status(200).send('No message to process');
  }
});

app.get('/messages', (req, res) => {
  res.json(Array.from(messages)); // Send the stored messages as JSON
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); // Serve the HTML file
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
