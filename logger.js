const winston = require('winston');

// Custom JSON format for logging
const customJSONFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
    return JSON.stringify({
        timestamp: timestamp,
        level: level,
        severity: level.toUpperCase(),
        message: message,
        stack: stack || ''
    });
});

// Create the logger instance
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        customJSONFormat
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: "/var/log/myapp/application.log",
            level: 'info'
        })
    ]
});

module.exports = logger;