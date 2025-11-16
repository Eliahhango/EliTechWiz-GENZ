const settings = require('../settings');
const { getChannelJoinMessage, getChannelLink, isMarkedAsMember } = require('../lib/channelEnforcer');

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

async function joinchannelCommand(sock, chatId, message, senderId) {
    try {
        const isMember = isMarkedAsMember(senderId);
        
        const text = isMember 
            ? `✅ *You're Already a Member!*\n\n` +
              `You have already joined our channel. Thank you for your support!\n\n` +
              `🔗 *Channel:* ${getChannelLink()}\n\n` +
              `*Powered by EliTechWiz*`
            : getChannelJoinMessage();

        await sock.sendMessage(chatId, {
            text: text,
            ...channelInfo
        }, { quoted: message });
    } catch (error) {
        const { handleError } = require('../lib/errorHandler');
        await handleError(sock, chatId, message, error, 'processing');
    }
}

module.exports = joinchannelCommand;

