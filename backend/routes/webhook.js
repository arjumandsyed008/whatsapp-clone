const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

router.post('/', async (req, res) => {
  const payload = req.body;

  if (payload.messages) {
    for (const m of payload.messages) {
      await Message.create({
        message_id: m.id,
        meta_msg_id: m.context?.id || null,
        wa_id: payload.contacts?.[0]?.wa_id || '',
        from: m.from,
        to: m.to,
        text: m.text?.body || '',
        attachments: m.image || m.document ? [m.image || m.document] : [],
        direction: 'in',
        status: 'sent',
        timestamp: new Date(Number(m.timestamp) * 1000),
        raw: payload
      });
    }
  }

  if (payload.statuses) {
    for (const s of payload.statuses) {
      await Message.updateOne(
        { $or: [{ message_id: s.id }, { meta_msg_id: s.id }] },
        { $set: { status: s.status } }
      );
    }
  }

  res.sendStatus(200);
});

module.exports = router;
