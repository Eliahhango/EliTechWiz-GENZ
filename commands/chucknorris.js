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

async function chucknorrisCommand(sock, chatId, message) {
    try {
        const response = await axios.get('https://api.chucknorris.io/jokes/random');
        
        if (response.data && response.data.value) {
            const joke = response.data.value;
            const text = `╔══「 💪 *CHUCK NORRIS JOKE* 」══╗\n\n${joke}\n\n╚═══════════════════╝\n*Powered by EliTechWiz*`;
            
            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } else {
            throw new Error('No joke received');
        }
    } catch (error) {
        console.error('ChuckNorris command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching Chuck Norris joke. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = chucknorrisCommand;

