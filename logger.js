const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, errors } = format;
const path = require('path');
// log format
const customFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

// Winston logger instance
const logger = createLogger({
  level: 'info',  
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),  
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: '/var/log/myapp/application.log' })
  ],
});

module.exports = logger;