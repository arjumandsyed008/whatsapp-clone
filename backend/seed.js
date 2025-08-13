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
      // Existing 10 messages
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
      },

      // New 10 messages
      {
        message_id: 'msg11',
        wa_id: '919666666666',
        from: '919666666666',
        to: 'me',
        text: 'Good morning! Are we still on for lunch?',
        direction: 'in',
        status: 'sent',
        timestamp: new Date(Date.now() - 1800000),
        raw: { contactName: 'Meera Nair' }
      },
      {
        message_id: 'msg12',
        wa_id: 'me',
        from: 'me',
        to: '919666666666',
        text: 'Yes, see you at 1 PM sharp!',
        direction: 'out',
        status: 'delivered',
        timestamp: new Date(Date.now() - 1700000),
        raw: { contactName: 'Meera Nair' }
      },
      {
        message_id: 'msg13',
        wa_id: '919999999999',
        from: 'me',
        to: '919999999999',
        text: 'Did you review the new proposal?',
        direction: 'out',
        status: 'sent',
        timestamp: new Date(Date.now() - 5000000),
        raw: { contactName: 'Ravi Kumar' }
      },
      {
        message_id: 'msg14',
        wa_id: '919999999999',
        from: '919999999999',
        to: 'me',
        text: 'Yes, looks good. I’ll send it to the client.',
        direction: 'in',
        status: 'read',
        timestamp: new Date(Date.now() - 4950000),
        raw: { contactName: 'Ravi Kumar' }
      },
      {
        message_id: 'msg15',
        wa_id: '919444444444',
        from: 'me',
        to: '919444444444',
        text: 'Flight is booked for Monday at 9am.',
        direction: 'out',
        status: 'sent',
        timestamp: new Date(Date.now() - 21600000),
        raw: { contactName: 'Travel Agent' }
      },
      {
        message_id: 'msg16',
        wa_id: '919444444444',
        from: '919444444444',
        to: 'me',
        text: 'Perfect, I’ll send the itinerary.',
        direction: 'in',
        status: 'delivered',
        timestamp: new Date(Date.now() - 21500000),
        raw: { contactName: 'Travel Agent' }
      },
      {
        message_id: 'msg17',
        wa_id: '919333333333',
        from: '919333333333',
        to: 'me',
        text: 'Meeting postponed to Thursday.',
        direction: 'in',
        status: 'sent',
        timestamp: new Date(Date.now() - 30000000),
        raw: { contactName: 'Office Admin' }
      },
      {
        message_id: 'msg18',
        wa_id: 'me',
        from: 'me',
        to: '919333333333',
        text: 'Got it, I’ll update the team.',
        direction: 'out',
        status: 'read',
        timestamp: new Date(Date.now() - 29900000),
        raw: { contactName: 'Office Admin' }
      },
      {
        message_id: 'msg19',
        wa_id: '919222222222',
        from: 'me',
        to: '919222222222',
        text: 'Happy Anniversary! 🎊',
        direction: 'out',
        status: 'read',
        timestamp: new Date(Date.now() - 604800000),
        raw: { contactName: 'Rajesh Mehta' }
      },
      {
        message_id: 'msg20',
        wa_id: '919222222222',
        from: '919222222222',
        to: 'me',
        text: 'Thank you! Means a lot.',
        direction: 'in',
        status: 'read',
        timestamp: new Date(Date.now() - 604700000),
        raw: { contactName: 'Rajesh Mehta' }
      }
    ];

    await Message.deleteMany({});
    await Message.insertMany(sampleData);

    console.log('✅ 20 sample messages with contact names inserted!');
    process.exit();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
