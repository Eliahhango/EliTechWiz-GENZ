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

async function colorCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🎨 Color Information Command*\n\n*Usage:* .color <hex or color name>\n\n*Examples:*\n.color #FF5733\n.color red\n.color FF5733`,
                ...channelInfo
            }, { quoted: message });
        }

        let colorInput = args[0].replace('#', '');
        
        // If it's a color name, convert to hex
        const colorNames = {
            'red': 'FF0000', 'blue': '0000FF', 'green': '00FF00',
            'yellow': 'FFFF00', 'purple': '800080', 'orange': 'FFA500',
            'pink': 'FFC0CB', 'black': '000000', 'white': 'FFFFFF',
            'gray': '808080', 'grey': '808080'
        };
        
        if (colorNames[colorInput.toLowerCase()]) {
            colorInput = colorNames[colorInput.toLowerCase()];
        }

        // Validate hex color
        if (!/^[0-9A-Fa-f]{6}$/.test(colorInput)) {
            return await sock.sendMessage(chatId, {
                text: '❌ Invalid color format. Use hex (e.g., #FF5733) or color name.',
                ...channelInfo
            }, { quoted: message });
        }

        const r = parseInt(colorInput.substring(0, 2), 16);
        const g = parseInt(colorInput.substring(2, 4), 16);
        const b = parseInt(colorInput.substring(4, 6), 16);

        // Create color image
        const colorImageUrl = `https://api.maher-zubair.tech/image/color?hex=${colorInput}`;
        
        const text = `╔══「 🎨 *COLOR INFORMATION* 」══╗\n\n` +
            `🎨 *Hex:* #${colorInput.toUpperCase()}\n` +
            `🔴 *RGB:* rgb(${r}, ${g}, ${b})\n` +
            `🔵 *RGB Values:*\n   R: ${r}\n   G: ${g}\n   B: ${b}\n\n` +
            `╚═══════════════════╝\n*Powered by EliTechWiz*`;

        try {
            await sock.sendMessage(chatId, {
                image: { url: colorImageUrl },
                caption: text,
                ...channelInfo
            }, { quoted: message });
        } catch (imageError) {
            // If image fails, send text only
            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        }
    } catch (error) {
        console.error('Color command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error processing color. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = colorCommand;

