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

async function quote2Command(sock, chatId, message) {
    try {
        const response = await axios.get('https://api.quotable.io/random');
        
        if (response.data) {
            const quote = response.data;
            const text = `╔══「 💬 *QUOTE* 」══╗\n\n"${quote.content}"\n\n— *${quote.author}*\n\n╚═══════════════════╝\n*Powered by EliTechWiz*`;
            
            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } else {
            throw new Error('No quote received');
        }
    } catch (error) {
        console.error('Quote2 command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching quote. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = quote2Command;

