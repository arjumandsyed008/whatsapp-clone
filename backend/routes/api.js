const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

/**
 * Get conversations list
 */
router.get('/conversations', async (req, res) => {
  try {
    const convs = await Message.aggregate([
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$wa_id",
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$status", "sent"] }, { $eq: ["$direction", "in"] }] },
                1,
                0
              ]
            }
          }
        }
      },
      { $sort: { "lastMessage.timestamp": -1 } }
    ]);

    const formatted = convs.map(c => ({
      wa_id: c._id,
      contactName: c.lastMessage?.raw?.contactName || c._id, // Stored name or fallback to wa_id
      lastMessage: c.lastMessage?.text || "",
      lastMessageStatus: c.lastMessage?.status || "",
      lastMessageTime: c.lastMessage?.timestamp
        ? new Date(c.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : "",
      unreadCount: c.unreadCount || 0
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching conversations:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get messages for a conversation
 * Also mark unread incoming messages as 'read'
 */
router.get('/conversations/:wa_id/messages', async (req, res) => {
  try {
    // Mark all incoming 'sent' messages as 'read'
    await Message.updateMany(
      { wa_id: req.params.wa_id, direction: 'in', status: 'sent' },
      { $set: { status: 'read' } }
    );

    // Fetch updated messages
    const msgs = await Message.find({ wa_id: req.params.wa_id }).sort({ timestamp: 1 });

    res.json(msgs);
  } catch (err) {
    console.error(`Error fetching messages for ${req.params.wa_id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Send message
 */
// Send message
router.post('/conversations/:wa_id/messages', async (req, res) => {
  try {
    const { text, from, to, contactName } = req.body;

    const msg = await Message.create({
      message_id: Date.now().toString(),
      wa_id: req.params.wa_id,
      from,
      to,
      text: typeof text === 'object' ? JSON.stringify(text) : text,
      direction: 'out',
      status: 'sent',
      timestamp: new Date(),
      raw: {
        contactName: contactName || req.params.wa_id // ✅ fallback to number if name missing
      }
    });

    res.json(msg);
  } catch (err) {
    console.error(`Error sending message to ${req.params.wa_id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
