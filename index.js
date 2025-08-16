const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const winston = require('winston');
const fs = require('fs');

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Modify client initialization to use session
const client = new Client({

});

// Replace this with your WhatsApp ID (from the console log when bot starts)
const MY_ID = '919916782028@c.us'; // ← replace with your actual WhatsApp ID

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    logger.info('QR Code generated');
});

client.on('ready', async () => {
    logger.info('WhatsApp bot is ready!');
    console.log('✅ WhatsApp bot is ready!');

    // Get contacts after client is ready
    try {
        const contacts = await client.getContacts();
        const me = contacts.find(c => c.isMe);
        console.log(`👤 Your WhatsApp ID is: ${me.id._serialized}`);
        logger.info('Retrieved WhatsApp ID', { id: me.id._serialized });
    } catch (err) {
        logger.error('Failed to get contacts', { error: err.message });
        console.error('❌ Error getting WhatsApp ID:', err.message);
    }
});

client.on('message', async message => {
  try {
    // Check if message exists
    if (!message || !message.body) {
      logger.warn('Received invalid message');
      console.log('⚠️ Received invalid message');
      return;
    }

    logger.info('Processing message', {
      from: message.from,
      sender: message._data.notifyName,
      messagePreview: message.body.substring(0, 50)
    });

    // Call the FastAPI server
    const response = await axios.post('http://localhost:8000/evaluate', {
      group: message.from || 'unknown',
      sender: message._data.notifyName || 'unknown',
      message: message.body
    });

    if (response.data.relevant) {
      logger.info('Relevant message detected', {
        from: message.from,
        messagePreview: message.body.substring(0, 50)
      });
      
      // Send alert message to your WhatsApp
      await client.sendMessage(MY_ID, 
        `🔔 *Relevant Message Detected!*\n\n` +
        `From: *${message.from}*\n` +
        `Sender: *${message._data.notifyName || 'Unknown'}*\n\n` +
        `Message: "${message.body}"\n\n`+ 
        `Summary: "${response.data.summary || 'No summary available'}"`
      );
      
      console.log(`🚨 Alert sent to WhatsApp: ${message.from}`);
    } 
    else {
      logger.debug('Message marked as not relevant', {
        from: message.from
      });
    }

  } catch (err) {
    logger.error('Error while processing message', {
      error: err.message,
      stack: err.stack
    });
    console.error('❌ Error while processing message:', err.message);
  }
});

client.initialize();

