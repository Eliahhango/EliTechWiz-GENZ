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

const remindersPath = path.join(__dirname, '../data/reminders.json');

function readReminders() {
    try {
        if (fs.existsSync(remindersPath)) {
            return JSON.parse(fs.readFileSync(remindersPath, 'utf8'));
        }
    } catch (error) {
        console.error('Error reading reminders:', error);
    }
    return {};
}

function writeReminders(data) {
    try {
        fs.writeFileSync(remindersPath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing reminders:', error);
    }
}

async function remindCommand(sock, chatId, message, args, senderId) {
    try {
        if (!args || args.length < 2) {
            return await sock.sendMessage(chatId, {
                text: `*⏰ Reminder Command*\n\n*Usage:* .remind <time> <message>\n\n*Time formats:*\n• 5m - 5 minutes\n• 1h - 1 hour\n• 30s - 30 seconds\n• 2d - 2 days\n\n*Example:* .remind 10m Call mom`,
                ...channelInfo
            }, { quoted: message });
        }

        const timeStr = args[0];
        const reminderText = args.slice(1).join(' ');

        // Parse time string (e.g., "5m", "1h", "30s")
        const timeMatch = timeStr.match(/^(\d+)([smhd])$/i);
        if (!timeMatch) {
            return await sock.sendMessage(chatId, {
                text: '❌ Invalid time format. Use: 5m, 1h, 30s, 2d',
                ...channelInfo
            }, { quoted: message });
        }

        const value = parseInt(timeMatch[1]);
        const unit = timeMatch[2].toLowerCase();
        
        let milliseconds = 0;
        switch (unit) {
            case 's': milliseconds = value * 1000; break;
            case 'm': milliseconds = value * 60 * 1000; break;
            case 'h': milliseconds = value * 60 * 60 * 1000; break;
            case 'd': milliseconds = value * 24 * 60 * 60 * 1000; break;
        }

        if (milliseconds > 7 * 24 * 60 * 60 * 1000) {
            return await sock.sendMessage(chatId, {
                text: '❌ Maximum reminder time is 7 days.',
                ...channelInfo
            }, { quoted: message });
        }

        const reminderId = `${senderId}_${Date.now()}`;
        const reminders = readReminders();
        
        reminders[reminderId] = {
            chatId,
            senderId,
            text: reminderText,
            time: Date.now() + milliseconds,
            createdAt: Date.now()
        };
        
        writeReminders(reminders);

        await sock.sendMessage(chatId, {
            text: `✅ *Reminder Set!*\n\n⏰ *Time:* ${timeStr}\n📝 *Message:* ${reminderText}\n\nI'll remind you when the time comes!`,
            ...channelInfo
        }, { quoted: message });

        setTimeout(async () => {
            const currentReminders = readReminders();
            if (currentReminders[reminderId]) {
                await sock.sendMessage(chatId, {
                    text: `⏰ *REMINDER*\n\n📝 ${reminderText}`,
                    mentions: [senderId],
                    ...channelInfo
                });
                delete currentReminders[reminderId];
                writeReminders(currentReminders);
            }
        }, milliseconds);
    } catch (error) {
        console.error('Remind command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error setting reminder. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = remindCommand;

