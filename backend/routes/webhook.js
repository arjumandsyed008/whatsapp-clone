const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// ✅ Webhook verification (GET)
router.get('/', (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Webhook verified');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
});

// ✅ Webhook message receiver (POST)
router.post('/', async (req, res) => {
  try {
    const body = req.body;

    if (body.object) {
      const entry = body.entry?.[0];
      const change = entry?.changes?.[0];
      const value = change?.value;
      const message = value?.messages?.[0];

      if (message) {
        const wa_id = message.from;
        const contactName = value?.contacts?.[0]?.profile?.name || wa_id;

        await Message.create({
          message_id: message.id,
          wa_id,
          from: wa_id,
          to: process.env.WHATSAPP_PHONE_NUMBER_ID || 'me',
          text: message.text?.body || '',
          direction: 'in',
          status: 'sent',
          timestamp: new Date(Number(message.timestamp) * 1000),
          raw: { contactName }
        });

        console.log(`💬 Message stored from ${contactName}`);
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.error('❌ Webhook error:', err);
    res.sendStatus(500);
  }
});

module.exports = router;
