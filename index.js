const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
require('dotenv').config();

const client = new Client({
    authStrategy: new LocalAuth()
});

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

client.on('qr', qr => {
    console.log('Scan this QR code with WhatsApp to connect the bot.');
    qrcode.generate(qr, { small: true }); // Generates the QR code in the terminal
});

client.on('ready', () => {
    console.log('✅ WhatsApp bot is ready to use.');
});

client.on('authenticated', () => {
    console.log('🔑 Bot successfully authenticated.');
});

client.on('message', async message => {
    // Ignore old messages
    if (message.timestamp < Math.floor(Date.now() / 1000) - 10) return;

    console.log(`📩 New message received: ${message.body}`);
    
    try {
        console.log('⏳ Querying Gemini...');
        
        const response = await axios.post(GEMINI_API_URL, {
            contents: [{ parts: [{ text: message.body }] }]
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        console.log('📩 Full response from Gemini:', JSON.stringify(response.data, null, 2));

        const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I didn't understand that.";

        console.log('💬 Generated response:', reply);

        await client.sendMessage(message.from, reply);
    } catch (error) {
        console.error('❌ Error querying Gemini:', error);
        await client.sendMessage(message.from, 'There was an error processing your message. Please try again later.');
    }
});

client.initialize();
