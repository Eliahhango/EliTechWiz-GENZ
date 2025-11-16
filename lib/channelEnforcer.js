const fs = require('fs');
const path = require('path');
const settings = require('../settings');

const channelDataFile = path.join(__dirname, '../data/channelMembers.json');

// Get channel link dynamically
function getChannelLink() {
    return global.channelLink || "https://whatsapp.com/channel/0029VaeEYF0BvvsZpaTPfL2s";
}

// Initialize channel members data file
function initChannelData() {
    if (!fs.existsSync(channelDataFile)) {
        const defaultData = {
            members: {},
            lastReminder: {}
        };
        fs.writeFileSync(channelDataFile, JSON.stringify(defaultData, null, 2));
    }
}

// Load channel members data
function loadChannelData() {
    try {
        initChannelData();
        const data = fs.readFileSync(channelDataFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading channel data:', error);
        return { members: {}, lastReminder: {} };
    }
}

// Save channel members data
function saveChannelData(data) {
    try {
        fs.writeFileSync(channelDataFile, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error saving channel data:', error);
    }
}

// Mark user as channel member
function markAsMember(userId) {
    const data = loadChannelData();
    data.members[userId] = {
        joined: true,
        timestamp: Date.now()
    };
    saveChannelData(data);
}

// Check if user is marked as member
function isMarkedAsMember(userId) {
    const data = loadChannelData();
    return data.members[userId]?.joined === true;
}

// Get last reminder time for user
function getLastReminder(userId) {
    const data = loadChannelData();
    return data.lastReminder[userId] || 0;
}

// Update last reminder time
function updateLastReminder(userId) {
    const data = loadChannelData();
    data.lastReminder[userId] = Date.now();
    saveChannelData(data);
}

// Check if enough time has passed since last reminder (5 minutes)
function shouldSendReminder(userId) {
    const lastReminder = getLastReminder(userId);
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    return (now - lastReminder) >= fiveMinutes;
}

// Handle channel enforcement for a user
async function enforceChannelJoin(sock, userId, userName) {
    try {
        // Skip if user is marked as member
        if (isMarkedAsMember(userId)) {
            return false;
        }

        // Check if we should send reminder (avoid spamming)
        if (!shouldSendReminder(userId)) {
            return false;
        }

        // Update last reminder time
        updateLastReminder(userId);

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

        const message = `╔══「 📢 *CHANNEL JOIN REQUIRED* 」══╗\n\n` +
            `👋 *Hello ${userName || 'User'}!*\n\n` +
            `⚠️ *You must join our WhatsApp Channel to continue using the bot.*\n\n` +
            `🔗 *Channel Link:*\n${getChannelLink()}\n\n` +
            `📌 *Instructions:*\n` +
            `1. Click the link above\n` +
            `2. Join the channel\n` +
            `3. Come back and use any command\n\n` +
            `✅ Once you join, you can use all bot features!\n\n` +
            `💡 *Tip:* Stay in the channel to avoid repeated reminders.\n\n` +
            `╚═══════════════════╝\n` +
            `*Powered by EliTechWiz*`;

        await sock.sendMessage(userId, { 
            text: message,
            ...channelInfo
        });

        return true;
    } catch (error) {
        console.error('Error enforcing channel join:', error);
        return false;
    }
}

// Handle periodic channel check (called on message events)
async function checkChannelMembership(sock, userId, userName, messageText) {
    try {
        // Skip if user is already marked as member
        if (isMarkedAsMember(userId)) {
            return;
        }

        // Check for channel join confirmation keywords
        const joinKeywords = ['joined', 'subscribe', 'subscribed', 'follow', 'following'];
        const lowerText = messageText?.toLowerCase() || '';
        
        // If user says they joined, mark them (they need to verify manually or we trust them)
        if (joinKeywords.some(keyword => lowerText.includes(keyword))) {
            // Don't auto-mark, require actual verification
            // This is a placeholder - actual verification would require channel API access
        }

        // Enforce channel join
        await enforceChannelJoin(sock, userId, userName);
    } catch (error) {
        console.error('Error checking channel membership:', error);
    }
}

// Verify user has joined channel (manual verification)
function verifyChannelJoin(userId) {
    markAsMember(userId);
    console.log(`✅ User ${userId} verified as channel member`);
}

// Reset user's channel status (if they leave)
function resetChannelStatus(userId) {
    const data = loadChannelData();
    if (data.members[userId]) {
        delete data.members[userId];
        delete data.lastReminder[userId];
        saveChannelData(data);
        console.log(`🔄 Reset channel status for user ${userId}`);
    }
}

// Get channel join message
function getChannelJoinMessage() {
    return `╔══「 📢 *JOIN OUR CHANNEL* 」══╗\n\n` +
        `🔗 *Channel Link:*\n${getChannelLink()}\n\n` +
        `📌 *Why join?*\n` +
        `• Get bot updates\n` +
        `• New features announcements\n` +
        `• Tips & tricks\n` +
        `• Community support\n\n` +
        `╚═══════════════════╝\n` +
        `*Powered by EliTechWiz*`;
}

// Periodic reminder system - check users every 30 minutes
setInterval(() => {
    try {
        const data = loadChannelData();
        const now = Date.now();
        const thirtyMinutes = 30 * 60 * 1000;
        
        // Reset reminders for users who haven't been active for 30 minutes
        // This allows re-reminding if they come back
        for (const userId in data.lastReminder) {
            if (now - data.lastReminder[userId] > thirtyMinutes) {
                // Keep the reminder timestamp but allow re-reminding
                // This ensures users get reminded again if they return
            }
        }
    } catch (error) {
        console.error('Error in periodic channel check:', error);
    }
}, 30 * 60 * 1000); // Every 30 minutes

// Initialize on module load
initChannelData();

module.exports = {
    enforceChannelJoin,
    checkChannelMembership,
    verifyChannelJoin,
    resetChannelStatus,
    isMarkedAsMember,
    markAsMember,
    getChannelJoinMessage,
    getChannelLink
};

