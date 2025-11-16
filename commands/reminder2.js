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

const remindersFile = path.join(__dirname, '../data/reminders.json');

function loadReminders() {
    try {
        if (fs.existsSync(remindersFile)) {
            return JSON.parse(fs.readFileSync(remindersFile, 'utf8'));
        }
    } catch (error) {
        console.error('Error loading reminders:', error);
    }
    return {};
}

function saveReminders(reminders) {
    try {
        const dir = path.dirname(remindersFile);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(remindersFile, JSON.stringify(reminders, null, 2));
    } catch (error) {
        console.error('Error saving reminders:', error);
    }
}

async function reminder2Command(sock, chatId, message, args, senderId) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*⏰ Reminder Command*\n\n*Usage:*\n.reminder2 add <time> <message>\n.reminder2 list\n.reminder2 delete <id>\n\n*Examples:*\n.reminder2 add 30m Call mom\n.reminder2 add 2h Meeting`,
                ...channelInfo
            }, { quoted: message });
        }

        const action = args[0].toLowerCase();
        const reminders = loadReminders();
        const userKey = `${chatId}_${senderId}`;

        if (!reminders[userKey]) {
            reminders[userKey] = [];
        }

        if (action === 'add') {
            if (args.length < 3) {
                return await sock.sendMessage(chatId, {
                    text: '❌ Usage: .reminder2 add <time> <message>\nExample: .reminder2 add 30m Call mom',
                    ...channelInfo
                }, { quoted: message });
            }

            const timeStr = args[1];
            const messageText = args.slice(2).join(' ');

            const timeMatch = timeStr.match(/(\d+)([smhd])/);
            if (!timeMatch) {
                return await sock.sendMessage(chatId, {
                    text: '❌ Invalid time format. Use: 30s, 5m, 2h, 1d',
                    ...channelInfo
                }, { quoted: message });
            }

            const value = parseInt(timeMatch[1]);
            const unit = timeMatch[2];
            let milliseconds = 0;

            switch (unit) {
                case 's': milliseconds = value * 1000; break;
                case 'm': milliseconds = value * 60 * 1000; break;
                case 'h': milliseconds = value * 60 * 60 * 1000; break;
                case 'd': milliseconds = value * 24 * 60 * 60 * 1000; break;
            }

            const reminderId = Date.now().toString();
            const reminderTime = Date.now() + milliseconds;

            reminders[userKey].push({
                id: reminderId,
                message: messageText,
                time: reminderTime,
                created: Date.now()
            });

            saveReminders(reminders);

            setTimeout(async () => {
                await sock.sendMessage(chatId, {
                    text: `⏰ *REMINDER*\n\n${messageText}\n\n*Set ${timeStr} ago*`,
                    ...channelInfo
                });
                
                const updatedReminders = loadReminders();
                if (updatedReminders[userKey]) {
                    updatedReminders[userKey] = updatedReminders[userKey].filter(r => r.id !== reminderId);
                    saveReminders(updatedReminders);
                }
            }, milliseconds);

            await sock.sendMessage(chatId, {
                text: `✅ *Reminder set!*\n\n⏰ *Time:* ${timeStr}\n📝 *Message:* ${messageText}\n🆔 *ID:* ${reminderId}`,
                ...channelInfo
            }, { quoted: message });
        } else if (action === 'list') {
            const userReminders = reminders[userKey] || [];
            if (userReminders.length === 0) {
                return await sock.sendMessage(chatId, {
                    text: '📋 *No active reminders*',
                    ...channelInfo
                }, { quoted: message });
            }

            let text = `╔══「 ⏰ *YOUR REMINDERS* 」══╗\n\n`;
            userReminders.forEach((reminder, index) => {
                const timeLeft = reminder.time - Date.now();
                const minutes = Math.floor(timeLeft / 60000);
                text += `${index + 1}. *${reminder.message}*\n   ⏰ ${minutes} minutes left\n   🆔 ${reminder.id}\n\n`;
            });
            text += `╚═══════════════════╝\n*Powered by EliTechWiz*`;

            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } else if (action === 'delete') {
            if (args.length < 2) {
                return await sock.sendMessage(chatId, {
                    text: '❌ Usage: .reminder2 delete <id>',
                    ...channelInfo
                }, { quoted: message });
            }

            const id = args[1];
            reminders[userKey] = reminders[userKey].filter(r => r.id !== id);
            saveReminders(reminders);

            await sock.sendMessage(chatId, {
                text: `✅ Reminder ${id} deleted`,
                ...channelInfo
            }, { quoted: message });
        } else {
            return await sock.sendMessage(chatId, {
                text: '❌ Invalid action. Use: add, list, or delete',
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Reminder2 command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error managing reminders. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = reminder2Command;

