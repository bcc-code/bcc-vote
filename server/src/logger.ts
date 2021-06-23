import { format, createLogger, transports } from 'winston';
import { LoggingWinston, Options } from '@google-cloud/logging-winston';

const isLocalEnvironment = process.env.VOTE_HOSTNAME?.includes('localhost');
console.log('isLocalEnvironment:',isLocalEnvironment);
console.log('Service:',process.env.K_SERVICE);

const serviceName = isLocalEnvironment ? 'localhost' : process.env.K_SERVICE;

const loggingWinston = new LoggingWinston({
    logName: `${serviceName}-logs`,
    serviceContext: {
        service: serviceName
    }
});

const addMetaData = format((info:any) => {
    info.appName = "My Program";
    return info;
});

const logger = createLogger({
    level: 'error',
    format: format.combine(
        addMetaData(),
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
