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

async function ytchannelCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*📺 YouTube Channel Info Command*\n\n*Usage:* .ytchannel <channel_name or channel_id>\n\n*Example:* .ytchannel PewDiePie`,
                ...channelInfo
            }, { quoted: message });
        }

        const query = args.join(' ');
        
        await sock.sendMessage(chatId, {
            text: `📺 *YouTube Channel Search*\n\n*Query:* ${query}\n\n*Note:* This feature requires YouTube API key. For now, please search manually on YouTube.\n\n*Powered by EliTechWiz*`,
            ...channelInfo
        }, { quoted: message });
    } catch (error) {
        console.error('YTchannel command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching channel info. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = ytchannelCommand;

