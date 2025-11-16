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

function randomHex() {
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

async function randomcolorCommand(sock, chatId, message) {
    try {
        const hex = randomHex();
        const rgb = hexToRgb(hex);

        const text = `╔══「 🎨 *RANDOM COLOR* 」══╗\n\n` +
            `🎨 *Hex:* ${hex}\n` +
            `🔴 *RGB:* ${rgb.r}, ${rgb.g}, ${rgb.b}\n\n` +
            `╚═══════════════════╝\n*Powered by EliTechWiz*`;

        await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
    } catch (error) {
        console.error('Randomcolor command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error generating random color. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = randomcolorCommand;

