# 🔧 Error Handling Guide

## Overview

All commands now use a centralized error handling system that provides unique, branded error messages. This ensures consistent, user-friendly error communication across the entire bot.

## Usage

### Basic Error Handling

```javascript
const { handleError } = require('../lib/errorHandler');

try {
    // Your command code here
} catch (error) {
    await handleError(sock, chatId, message, error, 'errorType');
}
```

### Custom Error Messages

```javascript
const { sendError } = require('../lib/errorHandler');

// Send a custom error message
await sendError(sock, chatId, message, 'errorType', 'Custom error message here');
```

## Error Types

Available error types with unique messages:

- `network` - Network/connection issues
- `api` - API/service errors
- `rateLimit` - Rate limiting errors
- `invalidInput` - Invalid user input
- `missingMedia` - Missing media files
- `permission` - Permission/access errors
- `processing` - General processing errors
- `notFound` - Not found errors
- `download` - Download errors
- `groupOnly` - Group-only command errors
- `generic` - Generic errors (default)

## Examples

### Example 1: YouTube Command
```javascript
} catch (error) {
    const { handleError } = require('../lib/errorHandler');
    await handleError(sock, chatId, message, error, 'api');
}
```

### Example 2: Sticker Command (Missing Media)
```javascript
if (!mediaMessage) {
    const { sendError } = require('../lib/errorHandler');
    await sendError(sock, chatId, message, 'missingMedia', 
        "🖼️ *No Media Found*\n\nI need an image or video! 📸");
    return;
}
```

### Example 3: Invalid Input
```javascript
if (!query) {
    const { sendError } = require('../lib/errorHandler');
    await sendError(sock, chatId, message, 'invalidInput',
        "❓ *Missing Query*\n\nI need a search term! 🎯");
    return;
}
```

## Benefits

✅ **Unique Messages** - Each error type has multiple unique messages (randomly selected)  
✅ **User-Friendly** - Friendly, branded messages instead of technical errors  
✅ **Consistent** - Same error handling pattern across all commands  
✅ **Maintainable** - Centralized error messages, easy to update  
✅ **Branded** - All messages include "Powered by EliTechWiz"  

## Migration

To update existing commands:

1. Import the error handler:
```javascript
const { handleError, sendError } = require('../lib/errorHandler');
```

2. Replace generic error messages:
```javascript
// Old
await sock.sendMessage(chatId, { text: '❌ Error occurred' });

// New
await handleError(sock, chatId, message, error, 'processing');
```

3. Replace specific error messages:
```javascript
// Old
await sock.sendMessage(chatId, { text: '❌ Invalid input' });

// New
await sendError(sock, chatId, message, 'invalidInput');
```

---

**Note**: The error handler automatically detects error types from error messages, but you can also specify the type manually for more control.

