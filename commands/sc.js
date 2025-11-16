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

async function scCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*📜 Source Code Command*\n\n*Usage:* .sc <github_username/repo>\n\n*Example:* .sc Eliahhango/EliTechWiz-GENZ`,
                ...channelInfo
            }, { quoted: message });
        }

        const repo = args[0];
        const [username, repoName] = repo.split('/');

        if (!username || !repoName) {
            return await sock.sendMessage(chatId, {
                text: '❌ Invalid format. Use: username/repo',
                ...channelInfo
            }, { quoted: message });
        }

        const repoUrl = `https://github.com/${username}/${repoName}`;
        const text = `╔══「 📜 *SOURCE CODE* 」══╗\n\n` +
            `📦 *Repository:* ${repo}\n` +
            `🔗 *GitHub URL:* ${repoUrl}\n` +
            `📥 *Clone:* git clone ${repoUrl}.git\n\n` +
            `*Powered by EliTechWiz*`;

        await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
    } catch (error) {
        console.error('SC command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error processing source code request. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = scCommand;

