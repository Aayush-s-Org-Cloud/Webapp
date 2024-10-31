const winston = require('winston');
const WinstonCloudWatch = require('winston-cloudwatch');

// Create a Winston logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()  
  ),
  transports: [
    // Console transport for development/testing
    new winston.transports.Console(),

    new winston.transports.File({ 
      filename: '/opt/nodeapp/logs/application.log',
      level: 'info'
    }),

    new WinstonCloudWatch({
      logGroupName: process.env.CLOUDWATCH_LOG_GROUP || 'MyAppLogGroup',  
      logStreamName: process.env.CLOUDWATCH_LOG_STREAM || 'MyAppLogStream',  
      awsRegion: process.env.AWS_REGION || 'us-east-1', 
      jsonMessage: true, 
      messageFormatter: ({ level, message, additionalInfo }) => JSON.stringify({ level, message, ...additionalInfo })
    })
  ],
  exitOnError: false
});
 
logger.on('error', function(err) {
  console.error('CloudWatch logging error:', err);
});

module.exports = logger;