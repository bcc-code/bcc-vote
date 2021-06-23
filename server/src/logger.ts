import { format, createLogger, transports } from 'winston';
import { LoggingWinston, Options } from '@google-cloud/logging-winston';

const isLocalEnvironment = process.env.VOTE_API_BASE_URL && process.env.VOTE_API_BASE_URL.includes('localhost');
const serviceName = isLocalEnvironment ? 'vote-local' : process.env.K_SERVICE;
const logOptions = {
    resource: { 
        type: 'global',
        labels: {
            service_name: serviceName,
        }
    }
} as Options;
const loggingWinston = new LoggingWinston(logOptions);


console.log('isLocalEnvironment:',isLocalEnvironment)

const logger = createLogger({
    level: 'error',
    format: format.combine(
        format.splat(),
        format.simple()
    ),
    transports: isLocalEnvironment === false ? [
        loggingWinston, 
        new transports.Console()
    ] : [new transports.Console()]
});

logger.error('Initialized winston!');

export default logger;
