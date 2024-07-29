const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const token = process.env.TELEGRAM_TOKEN;
const apiUrl = `https://api.telegram.org/bot${token}/sendMessage`;

let messages = [];

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Handle incoming messages from Telegram
app.post('/webhook', (req, res) => {
  const { message } = req.body;
  if (message && message.text) {
    const chatId = message.chat.id;
    const text = message.text;

    // For simplicity, assuming the location as 'Unknown location'
    const location = 'Unknown location'; // You may add logic to fetch location

    // Add message to in-memory storage
    messages.push({ text, location, date: new Date(), approved: false });

    res.status(200).send('Message received');
  } else {
    res.status(200).send('No message to process');
  }
});

// Endpoint to get messages
app.get('/messages', (req, res) => {
  res.json(messages);
});

// Endpoint to approve a message
app.post('/approve', (req, res) => {
  const { index } = req.body;
  if (messages[index]) {
    messages[index].approved = true;
    res.status(200).send('Message approved');
  } else {
    res.status(404).send('Message not found');
  }
});

// Endpoint to reject a message
app.post('/reject', (req, res) => {
  const { index } = req.body;
  if (messages[index]) {
    messages.splice(index, 1);
    res.status(200).send('Message rejected');
  } else {
    res.status(404).send('Message not found');
  }
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the dashboard HTML file
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
