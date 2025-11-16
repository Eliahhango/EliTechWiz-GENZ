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

async function adviceCommand(sock, chatId, message) {
    try {
        const response = await axios.get('https://api.adviceslip.com/advice');
        
        if (response.data && response.data.slip) {
            const advice = response.data.slip.advice;
            const text = `╔══「 💡 *ADVICE* 」══╗\n\n${advice}\n\n╚═══════════════════╝\n*Powered by EliTechWiz*`;
            
            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } else {
            throw new Error('No advice received');
        }
    } catch (error) {
        console.error('Advice command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching advice. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = adviceCommand;

