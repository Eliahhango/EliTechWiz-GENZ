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

async function dadjokeCommand(sock, chatId, message) {
    try {
        const response = await axios.get('https://icanhazdadjoke.com/', {
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.data && response.data.joke) {
            const joke = response.data.joke;
            const text = `╔══「 😂 *DAD JOKE* 」══╗\n\n${joke}\n\n╚═══════════════════╝\n*Powered by EliTechWiz*`;
            
            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } else {
            throw new Error('No joke received');
        }
    } catch (error) {
        console.error('Dad joke command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching dad joke. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = dadjokeCommand;

