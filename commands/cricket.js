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

async function cricketCommand(sock, chatId, message) {
    try {
        const response = await axios.get('https://cric-api.vercel.app/api/matches');
        
        if (response.data && response.data.matches) {
            let text = `╔══「 🏏 *CRICKET MATCHES* 」══╗\n\n`;
            const matches = response.data.matches.slice(0, 5); // Show top 5 matches
            
            matches.forEach((match, index) => {
                text += `${index + 1}. *${match.team1}* vs *${match.team2}*\n`;
                text += `   📅 ${match.date}\n`;
                text += `   🏟️ ${match.venue || 'TBD'}\n\n`;
            });
            
            text += `╚═══════════════════╝\n*Powered by EliTechWiz*`;
            
            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: '❌ No cricket matches found at the moment.',
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Cricket command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching cricket matches. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = cricketCommand;

