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

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }).join("");
}

async function color2Command(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🎨 Color Info Command*\n\n*Usage:* .color2 <hex or rgb>\n\n*Examples:*\n.color2 #FF5733\n.color2 255 87 51`,
                ...channelInfo
            }, { quoted: message });
        }

        const input = args.join(' ').toLowerCase();
        let rgb, hex;

        if (input.startsWith('#')) {
            hex = input;
            rgb = hexToRgb(hex);
            if (!rgb) {
                return await sock.sendMessage(chatId, {
                    text: '❌ Invalid hex color format. Use #RRGGBB',
                    ...channelInfo
                }, { quoted: message });
            }
        } else if (args.length === 3) {
            rgb = {
                r: parseInt(args[0]),
                g: parseInt(args[1]),
                b: parseInt(args[2])
            };
            if (isNaN(rgb.r) || isNaN(rgb.g) || isNaN(rgb.b) || 
                rgb.r < 0 || rgb.r > 255 || rgb.g < 0 || rgb.g > 255 || rgb.b < 0 || rgb.b > 255) {
                return await sock.sendMessage(chatId, {
                    text: '❌ Invalid RGB values. Use numbers between 0-255',
                    ...channelInfo
                }, { quoted: message });
            }
            hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        } else {
            return await sock.sendMessage(chatId, {
                text: '❌ Invalid format. Use hex (#FF5733) or RGB (255 87 51)',
                ...channelInfo
            }, { quoted: message });
        }

        const text = `╔══「 🎨 *COLOR INFO* 」══╗\n\n` +
            `🎨 *Hex:* ${hex.toUpperCase()}\n` +
            `🔴 *RGB:* ${rgb.r}, ${rgb.g}, ${rgb.b}\n` +
            `📊 *RGB %:* ${Math.round(rgb.r/255*100)}%, ${Math.round(rgb.g/255*100)}%, ${Math.round(rgb.b/255*100)}%\n\n` +
            `╚═══════════════════╝\n*Powered by EliTechWiz*`;

        await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
    } catch (error) {
        console.error('Color2 command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error processing color. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = color2Command;

