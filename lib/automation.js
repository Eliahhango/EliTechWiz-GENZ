/**
 * Automation Handler Module
 * Handles all automation features like auto-react, auto-blue-tick, auto-status-view, etc.
 */

const fs = require('fs');
const path = require('path');

// Load automation states
function loadAutomationState(fileName) {
    const filePath = path.join(__dirname, '../data', fileName);
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
    } catch (error) {
        console.error(`Error loading ${fileName}:`, error);
    }
    return { enabled: false };
}

// Check if automation is enabled
function isAutoreactEnabled() {
    return loadAutomationState('autoreact.json').enabled;
}

function isAutoblueEnabled() {
    return loadAutomationState('autoblue.json').enabled;
}

function isAutostatusviewEnabled() {
    return loadAutomationState('autostatusview.json').enabled;
}

function isAutostatuslikeEnabled() {
    return loadAutomationState('autostatuslike.json').enabled;
}

// Auto-react to messages
async function handleAutoReact(sock, message) {
    try {
        if (!isAutoreactEnabled()) return;
        
        // Don't react to bot's own messages
        if (message.key.fromMe) return;
        
        // Don't react to status updates
        if (message.key.remoteJid === 'status@broadcast') return;
        
        // Random emojis for reactions
        const emojis = ['❤️', '👍', '😂', '🔥', '✨', '💯', '👏', '🎉', '😍', '🤩'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        
        // Add delay to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        try {
            await sock.sendMessage(message.key.remoteJid, {
                react: {
                    text: randomEmoji,
                    key: message.key
                }
            });
        } catch (error) {
            if (!error.message?.includes('rate-overlimit')) {
                console.error('Auto-react error:', error.message);
            }
        }
    } catch (error) {
        console.error('Error in handleAutoReact:', error);
    }
}

// Auto blue tick (read receipts)
async function handleAutoBlueTick(sock, message) {
    try {
        if (!isAutoblueEnabled()) return;
        
        // Don't mark own messages as read
        if (message.key.fromMe) return;
        
        // Don't mark status updates as read (handled separately)
        if (message.key.remoteJid === 'status@broadcast') return;
        
        // Add delay to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
        
        try {
            await sock.readMessages([message.key]);
        } catch (error) {
            if (!error.message?.includes('rate-overlimit')) {
                console.error('Auto blue tick error:', error.message);
            }
        }
    } catch (error) {
        console.error('Error in handleAutoBlueTick:', error);
    }
}

// Auto view status updates
async function handleAutoStatusView(sock, status) {
    try {
        if (!isAutostatusviewEnabled()) return;
        
        let statusKey = null;
        
        // Handle different status update formats
        if (status.messages && status.messages.length > 0) {
            const msg = status.messages[0];
            if (msg.key && msg.key.remoteJid === 'status@broadcast') {
                statusKey = msg.key;
            }
        } else if (status.key && status.key.remoteJid === 'status@broadcast') {
            statusKey = status.key;
        } else if (status.reaction && status.reaction.key && status.reaction.key.remoteJid === 'status@broadcast') {
            statusKey = status.reaction.key;
        }
        
        if (!statusKey) return;
        
        // Add delay to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        try {
            await sock.readMessages([statusKey]);
        } catch (error) {
            if (error.message?.includes('rate-overlimit')) {
                console.log('⚠️ Rate limit hit for status view, waiting...');
                await new Promise(resolve => setTimeout(resolve, 5000));
                try {
                    await sock.readMessages([statusKey]);
                } catch (retryError) {
                    console.error('Retry failed for status view:', retryError.message);
                }
            } else {
                console.error('Auto status view error:', error.message);
            }
        }
    } catch (error) {
        console.error('Error in handleAutoStatusView:', error);
    }
}

// Auto like status updates
async function handleAutoStatusLike(sock, status) {
    try {
        if (!isAutostatuslikeEnabled()) return;
        
        let statusKey = null;
        
        // Handle different status update formats
        if (status.messages && status.messages.length > 0) {
            const msg = status.messages[0];
            if (msg.key && msg.key.remoteJid === 'status@broadcast') {
                statusKey = msg.key;
            }
        } else if (status.key && status.key.remoteJid === 'status@broadcast') {
            statusKey = status.key;
        } else if (status.reaction && status.reaction.key && status.reaction.key.remoteJid === 'status@broadcast') {
            statusKey = status.reaction.key;
        }
        
        if (!statusKey) return;
        
        // Add delay to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
        
        // Random heart emoji for status likes
        const heartEmojis = ['❤️', '💖', '💕', '💗', '💓', '💞'];
        const randomHeart = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        
        try {
            await sock.sendMessage(statusKey.remoteJid, {
                react: {
                    text: randomHeart,
                    key: statusKey
                }
            });
        } catch (error) {
            if (error.message?.includes('rate-overlimit')) {
                console.log('⚠️ Rate limit hit for status like, waiting...');
                await new Promise(resolve => setTimeout(resolve, 5000));
                try {
                    await sock.sendMessage(statusKey.remoteJid, {
                        react: {
                            text: randomHeart,
                            key: statusKey
                        }
                    });
                } catch (retryError) {
                    console.error('Retry failed for status like:', retryError.message);
                }
            } else {
                console.error('Auto status like error:', error.message);
            }
        }
    } catch (error) {
        console.error('Error in handleAutoStatusLike:', error);
    }
}

module.exports = {
    isAutoreactEnabled,
    isAutoblueEnabled,
    isAutostatusviewEnabled,
    isAutostatuslikeEnabled,
    handleAutoReact,
    handleAutoBlueTick,
    handleAutoStatusView,
    handleAutoStatusLike
};

