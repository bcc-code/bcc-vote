import 'dotenv/config';
import appInsights from './utils/appInsightsTelemetry';
import app from './app';
import logger from './logger';

const port = app.get('port');
const server = app.listen(port);
const startTime = Date.now();

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled rejection in promise', {promise, reason});
});

server.on('listening', () => {
    logger.info('Feathers application started on http://%s:%d', {host: app.get('host'), port});
    const duration = Date.now() - startTime;
    appInsights?.defaultClient?.trackMetric({name: 'Server startup time', value: duration});
});
