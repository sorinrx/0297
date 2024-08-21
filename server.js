const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
require('dotenv').config(); // Încarcă variabilele de mediu din fișierul .env

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Twilio Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN; // Twilio Auth Token
const client = new twilio(accountSid, authToken);

// Endpoint pentru a primi mesaje WhatsApp
app.post('/whatsapp', (req, res) => {
  const incomingMessage = req.body.Body;
  const from = req.body.From;

  console.log(`Received message from ${from}: ${incomingMessage}`);

  // Răspunde la mesaj
  client.messages.create({
    body: 'Hello from your chat application!',
    from: 'whatsapp:+14155238886', // Twilio WhatsApp number
    to: from
  }).then(message => console.log(`Message sent: ${message.sid}`))
    .catch(error => console.error(error));

  res.sendStatus(200);
});

// Pornirea serverului
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});