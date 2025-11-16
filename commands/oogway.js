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

async function oogwayCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🐢 Master Oogway Quote*\n\n*Usage:* .oogway <text>\n\n*Example:* .oogway There are no accidents`,
                ...channelInfo
            }, { quoted: message });
        }

        const text = args.join(' ');

        try {
            const response = await axios.get(`https://api.popcat.xyz/oogway`, {
                params: { text: text },
                responseType: 'arraybuffer'
            });

            if (response.data) {
                await sock.sendMessage(chatId, {
                    image: Buffer.from(response.data),
                    caption: `*🐢 Master Oogway*\n\n"${text}"\n\n_Powered by EliTechWiz_`,
                    ...channelInfo
                }, { quoted: message });
            } else {
                throw new Error('No image received');
            }
        } catch (apiError) {
            const text = `╔══「 🐢 *MASTER OOGWAY* 」══╗\n\n"${text}"\n\n— Master Oogway\n\n╚═══════════════════╝\n*Powered by EliTechWiz*`;

            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        }
    } catch (error) {
        console.error('Oogway command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error generating Oogway quote. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = oogwayCommand;

