/**
 * Rate Limiter
 * Prevents command spam and abuse
 */

const rateLimitMap = new Map();

// Rate limit configuration
const RATE_LIMITS = {
    default: { max: 10, window: 60000 }, // 10 commands per minute
    download: { max: 3, window: 60000 }, // 3 downloads per minute
    ai: { max: 5, window: 60000 }, // 5 AI requests per minute
    image: { max: 5, window: 60000 }, // 5 image commands per minute
    admin: { max: 20, window: 60000 } // 20 admin commands per minute
};

// Get rate limit config for command
function getRateLimitConfig(commandName) {
    if (commandName.includes('download') || commandName.includes('dl') || commandName.includes('ytmp4') || commandName.includes('play') || commandName.includes('song')) {
        return RATE_LIMITS.download;
    }
    if (commandName.includes('ai') || commandName.includes('gpt') || commandName.includes('gemini') || commandName.includes('imagine')) {
        return RATE_LIMITS.ai;
    }
    if (commandName.includes('sticker') || commandName.includes('blur') || commandName.includes('remini') || commandName.includes('removebg')) {
        return RATE_LIMITS.image;
    }
    if (commandName.includes('ban') || commandName.includes('kick') || commandName.includes('promote') || commandName.includes('mute')) {
        return RATE_LIMITS.admin;
    }
    return RATE_LIMITS.default;
}

// Check if user is rate limited
function isRateLimited(userId, commandName) {
    const config = getRateLimitConfig(commandName);
    const key = `${userId}:${commandName}`;
    const now = Date.now();
    
    if (!rateLimitMap.has(key)) {
        rateLimitMap.set(key, { count: 0, resetTime: now + config.window });
        return false;
    }
    
    const limit = rateLimitMap.get(key);
    
    // Reset if window expired
    if (now > limit.resetTime) {
        limit.count = 0;
        limit.resetTime = now + config.window;
        return false;
    }
    
    // Check if limit exceeded
    if (limit.count >= config.max) {
        return true;
    }
    
    // Increment count
    limit.count++;
    return false;
}

// Get remaining requests
function getRemainingRequests(userId, commandName) {
    const config = getRateLimitConfig(commandName);
    const key = `${userId}:${commandName}`;
    
    if (!rateLimitMap.has(key)) {
        return config.max;
    }
    
    const limit = rateLimitMap.get(key);
    const now = Date.now();
    
    if (now > limit.resetTime) {
        return config.max;
    }
    
    return Math.max(0, config.max - limit.count);
}

// Clean up old entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, limit] of rateLimitMap.entries()) {
        if (now > limit.resetTime + 60000) { // Keep for 1 minute after expiry
            rateLimitMap.delete(key);
        }
    }
}, 60000); // Clean every minute

module.exports = {
    isRateLimited,
    getRemainingRequests,
    getRateLimitConfig
};

