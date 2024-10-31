const { createLogger, format, transports } = require('winston');
const CloudWatchTransport = require('winston-cloudwatch');
const { combine, timestamp, printf, errors } = format;

// Generate a unique log stream name (e.g., based on timestamp)
const logStreamName = `application-log-stream-${Date.now()}`;

const customFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    customFormat
  ),
  transports: [
    new transports.Console(),
    new CloudWatchTransport({
      logGroupName: 'mystatsd',
      logStreamName: logStreamName,
      awsRegion: process.env.AWS_REGION || 'us-east-1',
      jsonMessage: true,
    })
  ],
  exitOnError: false
});

module.exports = logger;