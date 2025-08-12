require('dotenv').config();
const mongoose = require('mongoose');
const Message = require('./models/Message');

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('❌ MongoDB URI missing in .env');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    const sampleData = [
      {
        message_id: 'msg1',
        wa_id: '919876543210',
        from: 'me',
        to: '919876543210',
        text: 'Hey John! How’s it going?',
        direction: 'out',
        status: 'sent',
        timestamp: new Date(Date.now() - 600000),
        raw: { contactName: 'John Doe' }
      },
      {
        message_id: 'msg2',
        wa_id: '919876543210',
        from: '919876543210',
        to: 'me',
        text: 'Hey! All good, how about you?',
        direction: 'in',
        status: 'read',
        timestamp: new Date(Date.now() - 590000),
        raw: { contactName: 'John Doe' }
      },
      {
        message_id: 'msg3',
        wa_id: '919123456789',
        from: 'me',
        to: '919123456789',
        text: 'Hi Sarah, did you finish the report?',
        direction: 'out',
        status: 'sent',
        timestamp: new Date(Date.now() - 3600000),
        raw: { contactName: 'Sarah Khan' }
      },
      {
        message_id: 'msg4',
        wa_id: '919123456789',
        from: '919123456789',
        to: 'me',
        text: 'Yes, sending it now!',
        direction: 'in',
        status: 'read',
        timestamp: new Date(Date.now() - 3500000),
        raw: { contactName: 'Sarah Khan' }
      },
      {
        message_id: 'msg5',
        wa_id: '919555555555',
        from: '919555555555',
        to: 'me',
        text: 'Hello! How can we assist you today?',
        direction: 'in',
        status: 'sent',
        timestamp: new Date(Date.now() - 7200000),
        raw: { contactName: 'Tech Support' }
      },
      {
        message_id: 'msg6',
        wa_id: 'me',
        from: 'me',
        to: '919555555555',
        text: 'I’m facing an issue with my account login.',
        direction: 'out',
        status: 'delivered',
        timestamp: new Date(Date.now() - 7150000),
        raw: { contactName: 'Tech Support' }
      },
      {
        message_id: 'msg7',
        wa_id: '919888888888',
        from: 'me',
        to: '919888888888',
        text: 'Salam Ali, are we meeting tomorrow?',
        direction: 'out',
        status: 'sent',
        timestamp: new Date(Date.now() - 14400000),
        raw: { contactName: 'Ali Raza' }
      },
      {
        message_id: 'msg8',
        wa_id: '919888888888',
        from: '919888888888',
        to: 'me',
        text: 'Yes, see you at 5pm in the café.',
        direction: 'in',
        status: 'read',
        timestamp: new Date(Date.now() - 14300000),
        raw: { contactName: 'Ali Raza' }
      },
      {
        message_id: 'msg9',
        wa_id: '919777777777',
        from: 'me',
        to: '919777777777',
        text: 'Happy Birthday Priya 🎉',
        direction: 'out',
        status: 'read',
        timestamp: new Date(Date.now() - 86400000),
        raw: { contactName: 'Priya Sharma' }
      },
      {
        message_id: 'msg10',
        wa_id: '919777777777',
        from: '919777777777',
        to: 'me',
        text: 'Thank you so much! ❤️',
        direction: 'in',
        status: 'read',
        timestamp: new Date(Date.now() - 86300000),
        raw: { contactName: 'Priya Sharma' }
      }
    ];

    await Message.deleteMany({});
    await Message.insertMany(sampleData);

    console.log('✅ Sample messages with contact names inserted!');
    process.exit();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
