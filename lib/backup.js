/**
 * Auto Backup System
 * Automatically backs up important data files
 */

const fs = require('fs');
const path = require('path');

const backupDir = path.join(__dirname, '../backups');
const dataDir = path.join(__dirname, '../data');

// Files to backup
const filesToBackup = [
    'owner.json',
    'premium.json',
    'warnings.json',
    'messageCount.json',
    'channelMembers.json',
    'commandStats.json',
    'reminders.json',
    'todos.json',
    'notes.json',
    'afk.json'
];

// Ensure backup directory exists
function ensureBackupDir() {
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }
}

// Create backup
function createBackup() {
    try {
        ensureBackupDir();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
        const backupPath = path.join(backupDir, `backup-${timestamp}`);
        
        if (!fs.existsSync(backupPath)) {
            fs.mkdirSync(backupPath, { recursive: true });
        }
        
        let backedUp = 0;
        for (const file of filesToBackup) {
            const sourcePath = path.join(dataDir, file);
            const destPath = path.join(backupPath, file);
            
            if (fs.existsSync(sourcePath)) {
                fs.copyFileSync(sourcePath, destPath);
                backedUp++;
            }
        }
        
        console.log(`✅ Backup created: ${backedUp} files backed up to ${backupPath}`);
        return { success: true, files: backedUp, path: backupPath };
    } catch (error) {
        console.error('❌ Backup error:', error);
        return { success: false, error: error.message };
    }
}

// Restore from backup
function restoreBackup(backupDate) {
    try {
        const backupPath = path.join(backupDir, `backup-${backupDate}`);
        
        if (!fs.existsSync(backupPath)) {
            return { success: false, error: 'Backup not found' };
        }
        
        let restored = 0;
        for (const file of filesToBackup) {
            const sourcePath = path.join(backupPath, file);
            const destPath = path.join(dataDir, file);
            
            if (fs.existsSync(sourcePath)) {
                fs.copyFileSync(sourcePath, destPath);
                restored++;
            }
        }
        
        console.log(`✅ Restore completed: ${restored} files restored from ${backupPath}`);
        return { success: true, files: restored };
    } catch (error) {
        console.error('❌ Restore error:', error);
        return { success: false, error: error.message };
    }
}

// List available backups
function listBackups() {
    try {
        ensureBackupDir();
        const backups = fs.readdirSync(backupDir)
            .filter(item => item.startsWith('backup-'))
            .map(item => item.replace('backup-', ''))
            .sort()
            .reverse();
        return backups;
    } catch (error) {
        console.error('Error listing backups:', error);
        return [];
    }
}

// Clean old backups (keep last 7 days)
function cleanOldBackups() {
    try {
        ensureBackupDir();
        const backups = listBackups();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        let deleted = 0;
        for (const backup of backups) {
            const backupDate = new Date(backup);
            if (backupDate < sevenDaysAgo) {
                const backupPath = path.join(backupDir, `backup-${backup}`);
                if (fs.existsSync(backupPath)) {
                    fs.rmSync(backupPath, { recursive: true, force: true });
                    deleted++;
                }
            }
        }
        
        if (deleted > 0) {
            console.log(`🧹 Cleaned ${deleted} old backup(s)`);
        }
        return deleted;
    } catch (error) {
        console.error('Error cleaning backups:', error);
        return 0;
    }
}

// Auto backup daily
setInterval(() => {
    createBackup();
    cleanOldBackups();
}, 24 * 60 * 60 * 1000); // Every 24 hours

// Initial backup on startup
setTimeout(() => {
    createBackup();
}, 60000); // After 1 minute

module.exports = {
    createBackup,
    restoreBackup,
    listBackups,
    cleanOldBackups
};

