const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  message_id: String,
  wa_id: String,
  from: String,
  to: String,
  text: String,
  attachments: Array,
  direction: String,
  status: String,
  timestamp: Date,
  raw: {
    contactName: String // ✅ store name here
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
