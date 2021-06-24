import { format, createLogger, transports } from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';

const isLocalEnvironment = process.env.VOTE_HOSTNAME?.includes('localhost');
const serviceName = isLocalEnvironment ? 'localhost' : process.env.K_SERVICE;

const loggingWinston = new LoggingWinston({
    logName: `${serviceName}-logs`,
    serviceContext: {
        service: serviceName
    },
    resource: {
        type: 'cloud_run_revision',
        labels: {
            project_id: 'bcc-vote',
            service_name: serviceName,
            configuration_name: serviceName
        } as any
    },
});

const logger = createLogger({
    format: format.combine(
        format.splat(),
        format.simple()
    ),
    transports: isLocalEnvironment === false ? [
        loggingWinston, 
        new transports.Console()
    ] : [new transports.Console()]
});

export default logger;
