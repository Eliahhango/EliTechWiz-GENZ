/**
 * Command Statistics Tracker
 * Tracks command usage for analytics
 */

const fs = require('fs');
const path = require('path');

const statsFile = path.join(__dirname, '../data/commandStats.json');

// Initialize stats file
function initStats() {
    if (!fs.existsSync(statsFile)) {
        const defaultStats = {
            totalCommands: 0,
            commands: {},
            dailyStats: {},
            topCommands: []
        };
        fs.writeFileSync(statsFile, JSON.stringify(defaultStats, null, 2));
    }
}

// Load stats
function loadStats() {
    try {
        initStats();
        const data = fs.readFileSync(statsFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading command stats:', error);
        return { totalCommands: 0, commands: {}, dailyStats: {}, topCommands: [] };
    }
}

// Save stats
function saveStats(stats) {
    try {
        fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
    } catch (error) {
        console.error('Error saving command stats:', error);
    }
}

// Track command usage
function trackCommand(commandName, userId) {
    try {
        const stats = loadStats();
        stats.totalCommands++;
        
        const today = new Date().toISOString().split('T')[0];
        
        // Track per command
        if (!stats.commands[commandName]) {
            stats.commands[commandName] = {
                count: 0,
                users: [],
                lastUsed: null
            };
        }
        stats.commands[commandName].count++;
        if (!Array.isArray(stats.commands[commandName].users)) {
            stats.commands[commandName].users = [];
        }
        if (!stats.commands[commandName].users.includes(userId)) {
            stats.commands[commandName].users.push(userId);
        }
        stats.commands[commandName].lastUsed = new Date().toISOString();
        
        // Track daily stats
        if (!stats.dailyStats[today]) {
            stats.dailyStats[today] = {
                date: today,
                totalCommands: 0,
                uniqueUsers: [],
                commands: {}
            };
        }
        stats.dailyStats[today].totalCommands++;
        if (!Array.isArray(stats.dailyStats[today].uniqueUsers)) {
            stats.dailyStats[today].uniqueUsers = [];
        }
        if (!stats.dailyStats[today].uniqueUsers.includes(userId)) {
            stats.dailyStats[today].uniqueUsers.push(userId);
        }
        if (!stats.dailyStats[today].commands[commandName]) {
            stats.dailyStats[today].commands[commandName] = 0;
        }
        stats.dailyStats[today].commands[commandName]++;
        
        // Update top commands
        const commandArray = Object.entries(stats.commands)
            .map(([name, data]) => ({ name, count: data.count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
        stats.topCommands = commandArray;
        
        saveStats(stats);
    } catch (error) {
        console.error('Error tracking command:', error);
    }
}

// Get command statistics
function getCommandStats(commandName = null) {
    const stats = loadStats();
    if (commandName) {
        return stats.commands[commandName] || null;
    }
    return stats;
}

// Get top commands
function getTopCommands(limit = 10) {
    const stats = loadStats();
    return stats.topCommands.slice(0, limit);
}

// Initialize on load
initStats();

module.exports = {
    trackCommand,
    getCommandStats,
    getTopCommands,
    loadStats
};

