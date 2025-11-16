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

async function fact2Command(sock, chatId, message) {
    try {
        const response = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
        
        if (response.data && response.data.text) {
            const fact = response.data.text;
            const text = `╔══「 📚 *RANDOM FACT* 」══╗\n\n${fact}\n\n╚═══════════════════╝\n*Powered by EliTechWiz*`;
            
            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } else {
            throw new Error('No fact received');
        }
    } catch (error) {
        console.error('Fact2 command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching fact. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = fact2Command;

