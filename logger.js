const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, errors } = format;

// log format
const customFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

// Winston logger instance
const logger = createLogger({
  level: 'info', // Set the minimum log level
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),  
    customFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'application.log' })
  ],
});
