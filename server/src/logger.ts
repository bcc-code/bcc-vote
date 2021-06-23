import { format, createLogger, transports } from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';

const isLocalEnvironment = process.env.VOTE_HOSTNAME?.includes('localhost');
const serviceName = isLocalEnvironment ? 'localhost' : process.env.K_SERVICE;

const loggingWinston = new LoggingWinston({
    logName: `${serviceName}-logs`,
    serviceContext: {
        service: serviceName
    }
});

const logger = createLogger({
    defaultMeta: {
        resource: {
            labels: {
                configuration_name: serviceName,
                service_name: serviceName
            }
        }
    },
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
