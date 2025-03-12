const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * Deletes a folder and its contents if it exists.
 * @param {string} folderPath - The path of the folder to delete.
 */
const deleteFolder = (folderPath) => {
    if (fs.existsSync(folderPath)) {
        fs.rmSync(folderPath, { recursive: true, force: true });
        console.log(`🗑️ Deleted folder: ${folderPath}`);
    }
};

const authFolderPath = path.join(__dirname, '.wwebjs_auth');
deleteFolder(authFolderPath);

/** @type {Client} WhatsApp client instance */
const client = new Client({
    authStrategy: new LocalAuth()
});

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

/** 
 * Predefined context to maintain focus in AI responses.
 * @constant {string}
 */
const CONTEXT = `
You are an AI assistant specialized in...
`;

client.on('qr', qr => {
    console.log('Scan this QR code with WhatsApp to connect the bot.');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ WhatsApp bot is ready to use.');
});

client.on('authenticated', () => {
    console.log('🔑 Bot successfully authenticated.');
});

/**
 * Handles incoming messages and queries the Gemini API for responses.
 * @param {import('whatsapp-web.js').Message} message - The received message object.
 */
client.on('message', async message => {
    // Ignore messages older than 10 seconds
    if (message.timestamp < Math.floor(Date.now() / 1000) - 10) return;

    console.log(`📩 New message received: ${message.body}`);
    
    try {
        console.log('⏳ Querying Gemini...');
        
        const response = await axios.post(GEMINI_API_URL, {
            contents: [{ parts: [{ text: `${CONTEXT}\n\nUser: ${message.body}` }] }]
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        console.log('📩 Full response from Gemini:', JSON.stringify(response.data, null, 2));

        /** @type {string} Response text from Gemini */
        const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I didn't understand that.";

        console.log('💬 Generated response:', reply);

        await client.sendMessage(message.from, reply);
    } catch (error) {
        console.error('❌ Error querying Gemini:', error);
        await client.sendMessage(message.from, 'There was an error processing your message. Please try again later.');
    }
});

client.initialize();
