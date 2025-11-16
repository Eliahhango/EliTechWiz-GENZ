/**
 * Centralized Error Handler
 * Provides unique, branded error messages for all commands
 */

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

// Unique error messages for different error types
const errorMessages = {
    // Network/API Errors
    network: [
        "🌐 *Connection Issue*\n\nOops! I couldn't reach the server right now. The internet might be having a coffee break ☕\n\n*Try again in a moment!*",
        "📡 *Network Timeout*\n\nLooks like the server is taking a bit longer than usual. Sometimes even servers need a breather! 😅\n\n*Please try again shortly.*",
        "🔌 *Connection Lost*\n\nThe connection got interrupted. Don't worry, I'm still here! Just give it another shot 🎯"
    ],
    
    // API/Service Errors
    api: [
        "⚡ *Service Temporarily Unavailable*\n\nThe service I'm trying to reach is currently busy. Even APIs need rest sometimes! 😴\n\n*Try again in a few moments.*",
        "🔧 *API Error*\n\nSomething went wrong on the service side. I've logged this for the team to check! 📝\n\n*Please retry in a moment.*",
        "🌍 *External Service Issue*\n\nThe external service is experiencing some hiccups. Nothing serious, just temporary! ⏳\n\n*Wait a bit and try again.*"
    ],
    
    // Rate Limiting
    rateLimit: [
        "⏰ *Too Fast!*\n\nWhoa there, speedster! 🏎️ You're using commands faster than I can process them.\n\n*Slow down a bit and try again in a moment.*",
        "🚦 *Rate Limit Reached*\n\nYou've hit the speed limit! I need a moment to catch up with all your requests. 🐢\n\n*Please wait a few seconds before trying again.*"
    ],
    
    // Invalid Input
    invalidInput: [
        "❓ *Invalid Input*\n\nHmm, I didn't quite understand that. Could you check the format and try again? 🤔\n\n*Use .help for command examples.*",
        "📝 *Format Error*\n\nThat doesn't look quite right. Let me help you with the correct format! 📋\n\n*Check .help for proper usage.*",
        "🔍 *Input Not Recognized*\n\nI couldn't process that input. Make sure you're using the correct format! ✨\n\n*Type .help to see examples.*"
    ],
    
    // Missing Media/File
    missingMedia: [
        "🖼️ *No Media Found*\n\nI don't see any image or video in your message. Please send or reply to a media file! 📸\n\n*Reply to an image/video or send one with the command.*",
        "📎 *Media Required*\n\nThis command needs a media file to work. Send an image or video, or reply to one! 🎬\n\n*Attach media and try again.*",
        "🎥 *No Media Detected*\n\nI need a media file for this command. Reply to an image/video or send one! 📷\n\n*Include media in your message.*"
    ],
    
    // Permission Errors
    permission: [
        "🔒 *Access Denied*\n\nSorry, but you don't have permission to use this command. Only authorized users can access this feature! 🛡️\n\n*Contact an admin if you need access.*",
        "👮 *Admin Only*\n\nThis command is restricted to group admins only. Make sure you have admin privileges! 👑\n\n*Ask a group admin for help.*",
        "🚫 *Permission Required*\n\nYou need special permissions to use this command. This feature is for authorized users only! 🔐\n\n*Contact the bot owner for access.*"
    ],
    
    // Processing Errors
    processing: [
        "⚙️ *Processing Error*\n\nSomething went wrong while processing your request. I'm working on fixing it! 🔧\n\n*Please try again in a moment.*",
        "🔄 *Operation Failed*\n\nThe operation couldn't complete successfully. Don't worry, I've noted this issue! 📊\n\n*Retry the command shortly.*",
        "💥 *Unexpected Error*\n\nAn unexpected error occurred. The team has been notified! 🚨\n\n*Try again, and if it persists, contact support.*"
    ],
    
    // Not Found Errors
    notFound: [
        "🔍 *Not Found*\n\nI searched everywhere but couldn't find what you're looking for. Double-check your input! 🔎\n\n*Verify the details and try again.*",
        "❌ *No Results*\n\nSorry, I couldn't find any results for your query. Try different keywords! 🎯\n\n*Refine your search and try again.*",
        "🚫 *Item Not Found*\n\nThe item you're looking for doesn't exist or has been removed. Check your input! 📦\n\n*Verify and try a different search.*"
    ],
    
    // Generic Errors
    generic: [
        "😅 *Oops! Something Went Wrong*\n\nI encountered an unexpected issue. But don't worry, I'm still here and ready to help! 💪\n\n*Try again in a moment.*",
        "🤖 *Bot Error*\n\nI hit a snag while processing your request. The issue has been logged for review! 📝\n\n*Please retry shortly.*",
        "⚡ *Quick Error*\n\nA quick hiccup occurred, but I'm back on track! Give it another try! 🚀\n\n*Retry the command now.*"
    ],
    
    // Download Errors
    download: [
        "📥 *Download Failed*\n\nThe download couldn't complete. This might be due to network issues or the source being unavailable. 🌐\n\n*Check your connection and try again.*",
        "🔗 *Link Error*\n\nThe link you provided couldn't be processed. Make sure it's valid and accessible! 🔍\n\n*Verify the link and retry.*",
        "⏳ *Download Timeout*\n\nThe download is taking too long. The file might be too large or the server is slow. ⏰\n\n*Try again or use a different source.*"
    ],
    
    // Group Only Errors
    groupOnly: [
        "👥 *Group Command Only*\n\nThis command can only be used in groups, not in private chats! 💬\n\n*Use this command in a group chat.*",
        "🏘️ *Group Required*\n\nSorry, this feature is exclusive to group chats. Create or join a group to use it! 🎉\n\n*Switch to a group chat.*"
    ]
};

// Get random error message for type
function getErrorMessage(type = 'generic') {
    const messages = errorMessages[type] || errorMessages.generic;
    return messages[Math.floor(Math.random() * messages.length)];
}

// Send error message to user
async function sendError(sock, chatId, message, errorType = 'generic', customMessage = null) {
    try {
        const errorText = customMessage || getErrorMessage(errorType);
        const fullMessage = `${errorText}\n\n*Powered by ${settings.botName || 'EliTechWiz'}*`;
        
        await sock.sendMessage(chatId, {
            text: fullMessage,
            ...channelInfo
        }, { quoted: message });
    } catch (sendError) {
        console.error('Failed to send error message:', sendError);
    }
}

// Handle specific error types
function getErrorType(error) {
    if (!error) return 'generic';
    
    const errorMsg = error.message?.toLowerCase() || error.toString().toLowerCase();
    
    // Network errors
    if (errorMsg.includes('network') || errorMsg.includes('econnrefused') || errorMsg.includes('timeout') || errorMsg.includes('enotfound')) {
        return 'network';
    }
    
    // API errors
    if (errorMsg.includes('api') || errorMsg.includes('429') || errorMsg.includes('rate limit')) {
        if (errorMsg.includes('429') || errorMsg.includes('rate limit')) {
            return 'rateLimit';
        }
        return 'api';
    }
    
    // Permission errors
    if (errorMsg.includes('permission') || errorMsg.includes('admin') || errorMsg.includes('unauthorized') || errorMsg.includes('403')) {
        return 'permission';
    }
    
    // Not found errors
    if (errorMsg.includes('not found') || errorMsg.includes('404') || errorMsg.includes('no results')) {
        return 'notFound';
    }
    
    // Download errors
    if (errorMsg.includes('download') || errorMsg.includes('fetch') || errorMsg.includes('failed to fetch')) {
        return 'download';
    }
    
    return 'generic';
}

// Enhanced error handler with automatic type detection
async function handleError(sock, chatId, message, error, errorType = null) {
    const detectedType = errorType || getErrorType(error);
    await sendError(sock, chatId, message, detectedType);
    
    // Log error for debugging
    console.error(`[${detectedType.toUpperCase()}] Error in ${chatId}:`, error.message || error);
}

module.exports = {
    sendError,
    handleError,
    getErrorMessage,
    getErrorType,
    errorMessages,
    channelInfo
};

