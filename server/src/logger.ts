import { format, createLogger, transports, LoggerOptions } from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';

const isLocalEnvironment = process.env.VOTE_HOSTNAME?.includes('localhost');
const serviceName = isLocalEnvironment ? 'localhost' : process.env.K_SERVICE;
const loggingLevel = process.env.LOGGING_LEVEL ?? 'debug';
const label = `VoteLogger-${serviceName}`;
const errorLabel = label + '-errorHandler';

const consoleLogger = new transports.Console({
    format: format.combine(
        format.colorize({all: true}),
        format.json(),
        format.prettyPrint(),
        format.splat(),
        format.timestamp({
            format: 'DD-MM-YYYY HH:mm:ss',
        }),
        format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`)
    ),
});

const stackDriverLogger = new LoggingWinston({
    logName: `${serviceName}-logs`,
    labels: {label},
    serviceContext: {
        service: serviceName,
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

const options:LoggerOptions = {
    level: loggingLevel,
    format: format.combine(
        format.json(),
        format.prettyPrint(),
        format.splat(),
        format.label({
            label: label,
            message: false,
        })
    ),
    transports: isLocalEnvironment ? [consoleLogger] : [stackDriverLogger],
    exceptionHandlers: [
        new LoggingWinston({
            labels: {errorLabel},
            serviceContext: {
                service: serviceName,
            },
        }),
    ],
    handleExceptions: true,
    exitOnError: false,
};
const logger = createLogger(options);

export default logger;