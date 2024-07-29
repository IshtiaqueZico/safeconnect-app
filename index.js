const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const token = process.env.TELEGRAM_TOKEN;
const apiUrl = `https://api.telegram.org/bot${token}/sendMessage`;

let messages = [];

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Function to add a new message
const addMessage = (text, location = 'Unknown location') => {
  messages.push({
    text,
    location,
    date: new Date(),
    approved: false,
    urgent: false,
  });
};

// Handle incoming messages from Telegram
app.post('/webhook', (req, res) => {
  const { message } = req.body;
  if (message && message.text) {
    addMessage(message.text);
    res.status(200).send('Message received');
  } else {
    res.status(200).send('No message to process');
  }
});

// Endpoint to get all messages
app.get('/messages', (req, res) => {
  res.json(messages);
});

// Endpoint to get a single message by index
app.get('/message/:index', (req, res) => {
  const { index } = req.params;
  const message = messages[parseInt(index, 10)];
  if (message) {
    res.json(message);
  } else {
    res.status(404).send('Message not found');
  }
});

// Endpoint to update a message property
const updateMessage = (req, res, property) => {
  const { index } = req.body;
  if (messages[index]) {
    messages[index][property] = req.body[property];
    res.status(200).send(`Message ${property} updated`);
  } else {
    res.status(404).send('Message not found');
  }
};

// Approve a message
app.post('/approve', (req, res) => updateMessage(req, res, 'approved'));

// Reject a message
app.post('/reject', (req, res) => {
  const { index } = req.body;
  if (messages[index]) {
    messages.splice(index, 1);
    res.status(200).send('Message rejected');
  } else {
    res.status(404).send('Message not found');
  }
});

// Edit a message
app.post('/edit', (req, res) => {
  const { index, text } = req.body;
  if (messages[index]) {
    messages[index].text = text;
    res.status(200).send('Message edited');
  } else {
    res.status(404).send('Message not found');
  }
});

// Mark a message as urgent
app.post('/urgent', (req, res) => updateMessage(req, res, 'urgent'));

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the dashboard HTML file
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
