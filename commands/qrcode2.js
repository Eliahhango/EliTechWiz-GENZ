const QRCode = require('qrcode');
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

async function qrcode2Command(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*📱 QR Code Generator Command*\n\n*Usage:* .qrcode2 <text or url>\n\n*Example:* .qrcode2 https://github.com/Eliahhango/EliTechWiz-GENZ`,
                ...channelInfo
            }, { quoted: message });
        }

        const text = args.join(' ');
        const qrCodeBuffer = await QRCode.toBuffer(text, {
            width: 300,
            margin: 2
        });

        await sock.sendMessage(chatId, {
            image: qrCodeBuffer,
            caption: `*QR Code for:* ${text}\n\n*Powered by EliTechWiz*`,
            ...channelInfo
        }, { quoted: message });
    } catch (error) {
        console.error('QRCode2 command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error generating QR code. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = qrcode2Command;

