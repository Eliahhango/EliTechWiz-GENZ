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

async function quote3Command(sock, chatId, message, args) {
    try {
        const category = args && args.length > 0 ? args[0].toLowerCase() : 'random';
        
        let url = 'https://api.quotable.io/random';
        if (category !== 'random') {
            url += `?tags=${category}`;
        }

        const response = await axios.get(url);

        if (response.data) {
            const quote = response.data;
            const text = `╔══「 💬 *QUOTE* 」══╗\n\n"${quote.content}"\n\n— *${quote.author}*\n\n`;
            
            if (quote.tags && quote.tags.length > 0) {
                text += `🏷️ *Tags:* ${quote.tags.join(', ')}\n`;
            }
            
            text += `\n╚═══════════════════╝\n*Powered by EliTechWiz*`;

            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } else {
            throw new Error('No quote received');
        }
    } catch (error) {
        console.error('Quote3 command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching quote. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = quote3Command;

