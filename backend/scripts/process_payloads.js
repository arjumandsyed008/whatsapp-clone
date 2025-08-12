const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const Message = require('../models/Message');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const folder = path.join(__dirname, 'payloads');
  const files = fs.readdirSync(folder);

  for (const file of files) {
    const payload = JSON.parse(fs.readFileSync(path.join(folder, file)));

    if (payload.messages) {
      for (const m of payload.messages) {
        await Message.create({
          message_id: m.id,
          meta_msg_id: m.context?.id || null,
          wa_id: payload.contacts?.[0]?.wa_id || '',
          from: m.from,
          to: m.to,
          text: m.text?.body || '',
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
  }

  console.log('Payload processing complete.');
  process.exit();
})();
