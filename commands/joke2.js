const axios = require('axios');
const settings = require('../settings');

const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363222395675670@newsletter',
            newsletterName: 'EliTechWiz-GENZ',
            serverMessageId: -1
        }
    }
};

async function joke2Command(sock, chatId, message) {
    try {
        const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
        
        if (response.data) {
            const joke = response.data;
            const text = `╔══「 😂 *JOKE* 」══╗\n\n*${joke.setup}*\n\n*${joke.punchline}*\n\n╚═══════════════════╝\n*Powered by EliTechWiz*`;
            
            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } else {
            throw new Error('No joke received');
        }
    } catch (error) {
        console.error('Joke2 command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching joke. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = joke2Command;

