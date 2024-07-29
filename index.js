const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;
const token = '7495888669:AAGekL9WnL30aK5Tbx9G_GPcREnFdHFg9-o';
const apiUrl = `https://api.telegram.org/bot${token}/sendMessage`;

app.use(express.json());

app.post('/webhook', async (req, res) => {
  const { message } = req.body;
  if (message && message.text) {
    const chatId = message.chat.id;
    const text = message.text;

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
    res.status(200).send('No message to process');
  }
});

app.get('/', (req, res) => {
  res.send('Telegram bot server is running.');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
