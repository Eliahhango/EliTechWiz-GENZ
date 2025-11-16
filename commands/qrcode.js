const qrcode = require('qrcode');
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

async function qrcodeCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*📱 QR Code Generator Command*\n\n*Usage:* .qrcode <text or url>\n\n*Example:* .qrcode https://github.com/Eliahhango/EliTechWiz-GENZ`,
                ...channelInfo
            }, { quoted: message });
        }

        const text = args.join(' ');
        const qrBuffer = await qrcode.toBuffer(text, {
            errorCorrectionLevel: 'H',
            type: 'png',
            width: 500,
            margin: 2
        });

        await sock.sendMessage(chatId, {
            image: qrBuffer,
            caption: `📱 *QR Code*\n\n*Content:* ${text}\n\n*Powered by EliTechWiz*`,
            ...channelInfo
        }, { quoted: message });
    } catch (error) {
        console.error('QR Code command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error generating QR code. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = qrcodeCommand;

