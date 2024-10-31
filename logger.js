const winston = require('winston');

const customJSONFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
    return JSON.stringify({
        timestamp: timestamp,
        level: level,
        severity: level.toUpperCase(),
        message: message,
        stack: stack || ''
    });
});

const logger = winston.createLogger({
    level: 'info',  
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),  
        customJSONFormat
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),  
        }),
        new winston.transports.File({
            filename: "/var/log/myapp/application.log",  
            level: 'info' 
        })
    ]
});

module.exports = logger;