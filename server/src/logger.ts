import { format, createLogger, transports } from 'winston';
import {isAvailable, instance} from 'gcp-metadata';
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

const generateDriver = (optionsOverride?:any) => {
    return new LoggingWinston({
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
        ...optionsOverride
    });
};

const stackDriverLogger = generateDriver();

const generateLogger = (optionsOverride?:any) => {
    return createLogger({
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
        ...optionsOverride
    });
};

export const logger = generateLogger();

export const instanceLogger = async () => {
    try {
        let gcpInstance;
        if(await isAvailable()) {
            gcpInstance = await instance();
        }
        const stackDriver = generateDriver({
            resource: {
                type: 'cloud_run_revision',
                labels: {
                    project_id: 'bcc-vote',
                    service_name: serviceName,
                    configuration_name: serviceName,
                    instance: gcpInstance
                } as any
            },
        });
    
        return generateLogger({
            transports: isLocalEnvironment ? [consoleLogger] : [stackDriver],
        });    
    } catch(err) {
        console.error(err);
        return logger;
    }  
};
