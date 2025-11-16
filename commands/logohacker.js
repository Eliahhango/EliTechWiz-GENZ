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

async function logohackerCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*👨‍💻 Hacker Logo Command*\n\n*Usage:* .logohacker <text>\n\n*Example:* .logohacker EliTechWiz`,
                ...channelInfo
            }, { quoted: message });
        }

        const text = args.join(' ');
        
        // Using textpro.me API or similar
        const apiUrl = `https://api.textpro.me/create/anonymous-hacker-avatars-cyan-neon-677`;
        
        try {
            // Create logo using textpro API
            const response = await axios.post(apiUrl, {
                text: text,
                server_id: 1
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            
            if (response.data && response.data.image_url) {
                await sock.sendMessage(chatId, {
                    image: { url: response.data.image_url },
                    caption: `👨‍💻 *Hacker Logo*\n\n*Text:* ${text}\n\n*Powered by EliTechWiz*`,
                    ...channelInfo
                }, { quoted: message });
            } else {
                throw new Error('No image URL in response');
            }
        } catch (apiError) {
            // Fallback to alternative API
            try {
                const fallbackUrl = `https://api.maher-zubair.tech/textpro/hacker?text=${encodeURIComponent(text)}`;
                const fallback = await axios.get(fallbackUrl);
                
                if (fallback.data && fallback.data.result) {
                    await sock.sendMessage(chatId, {
                        image: { url: fallback.data.result },
                        caption: `👨‍💻 *Hacker Logo*\n\n*Text:* ${text}\n\n*Powered by EliTechWiz*`,
                        ...channelInfo
                    }, { quoted: message });
                } else {
                    throw new Error('Fallback API failed');
                }
            } catch (fallbackError) {
                throw new Error('All logo APIs failed');
            }
        }
    } catch (error) {
        console.error('Hacker logo error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error generating hacker logo. Please try again later.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = logohackerCommand;

