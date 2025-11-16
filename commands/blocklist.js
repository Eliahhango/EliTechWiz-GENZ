const fs = require('fs');
const path = require('path');
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

const blocklistFile = path.join(__dirname, '../data/blocklist.json');

function loadBlocklist() {
    try {
        if (fs.existsSync(blocklistFile)) {
            return JSON.parse(fs.readFileSync(blocklistFile, 'utf8'));
        }
    } catch (error) {
        console.error('Error loading blocklist:', error);
    }
    return { users: [] };
}

function saveBlocklist(blocklist) {
    try {
        const dir = path.dirname(blocklistFile);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(blocklistFile, JSON.stringify(blocklist, null, 2));
    } catch (error) {
        console.error('Error saving blocklist:', error);
    }
}

async function blocklistCommand(sock, chatId, message, args) {
    try {
        const blocklist = loadBlocklist();
        
        if (!args || args.length === 0) {
            const count = blocklist.users.length;
            return await sock.sendMessage(chatId, {
                text: `*🚫 Blocklist Command*\n\n*Blocked Users:* ${count}\n\n*Usage:*\n.blocklist add @user - Block a user\n.blocklist remove @user - Unblock a user\n.blocklist list - Show blocked users`,
                ...channelInfo
            }, { quoted: message });
        }

        const action = args[0].toLowerCase();
        const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

        if (action === 'list') {
            if (blocklist.users.length === 0) {
                return await sock.sendMessage(chatId, {
                    text: '📋 *No users in blocklist*',
                    ...channelInfo
                }, { quoted: message });
            }

            let text = `╔══「 🚫 *BLOCKLIST* 」══╗\n\n`;
            blocklist.users.forEach((jid, index) => {
                text += `${index + 1}. ${jid}\n`;
            });
            text += `\n╚═══════════════════╝\n*Powered by EliTechWiz*`;

            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } else if (action === 'add') {
            if (mentioned.length === 0) {
                return await sock.sendMessage(chatId, {
                    text: '❌ Please mention a user to block.',
                    ...channelInfo
                }, { quoted: message });
            }

            const userJid = mentioned[0];
            if (!blocklist.users.includes(userJid)) {
                blocklist.users.push(userJid);
                saveBlocklist(blocklist);
                await sock.sendMessage(chatId, {
                    text: `✅ User blocked: ${userJid}`,
                    mentions: [userJid],
                    ...channelInfo
                }, { quoted: message });
            } else {
                await sock.sendMessage(chatId, {
                    text: '⚠️ User is already blocked.',
                    ...channelInfo
                }, { quoted: message });
            }
        } else if (action === 'remove') {
            if (mentioned.length === 0) {
                return await sock.sendMessage(chatId, {
                    text: '❌ Please mention a user to unblock.',
                    ...channelInfo
                }, { quoted: message });
            }

            const userJid = mentioned[0];
            blocklist.users = blocklist.users.filter(jid => jid !== userJid);
            saveBlocklist(blocklist);
            await sock.sendMessage(chatId, {
                text: `✅ User unblocked: ${userJid}`,
                mentions: [userJid],
                ...channelInfo
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: '❌ Invalid action. Use: add, remove, or list',
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Blocklist command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error managing blocklist. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

function isBlocked(userJid) {
    const blocklist = loadBlocklist();
    return blocklist.users.includes(userJid);
}

module.exports = { blocklistCommand, isBlocked };

