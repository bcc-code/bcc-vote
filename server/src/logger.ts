import { format, createLogger, transports } from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';

const loggingWinston = new LoggingWinston();

// Create a Winston logger that streams to Stackdriver Logging
// Logs will be written to: "projects/YOUR_PROJECT_ID/logs/winston_log"
const logger = createLogger({
    level: 'error',
    format: format.combine(
        format.splat(),
        format.simple()
    ),
    transports: [
        new transports.Console(),
        loggingWinston,
    ],
});

logger.error('Initialized winston!');

export default logger;
