const express = require('express');
const axios = require('axios');
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

// Handle incoming messages from Telegram
app.post('/webhook', (req, res) => {
  const { message } = req.body;
  if (message && message.text) {
    const text = message.text;
    const location = 'Unknown location'; // Placeholder for location logic

    messages.push({ text, location, date: new Date(), approved: false, urgent: false });

    res.status(200).send('Message received');
  } else {
    res.status(200).send('No message to process');
  }
});

// Endpoint to get messages
app.get('/messages', (req, res) => {
  res.json(messages);
});

// Endpoint to get a single message by ID
app.get('/message/:id', (req, res) => {
  const { id } = req.params;
  const message = messages[id];
  if (message) {
    res.json(message);
  } else {
    res.status(404).send('Message not found');
  }
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

// Endpoint to edit a message
app.post('/edit', (req, res) => {
  const { index, text } = req.body;
  if (messages[index]) {
    messages[index].text = text;
    res.status(200).send('Message edited');
  } else {
    res.status(404).send('Message not found');
  }
});

// Endpoint to mark a message as urgent
app.post('/urgent', (req, res) => {
  const { index } = req.body;
  if (messages[index]) {
    messages[index].urgent = true;
    res.status(200).send('Message marked as urgent');
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
