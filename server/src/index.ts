import 'dotenv/config';
import appInsights from './utils/appInsightsTelemetry';
import app from './app';
import logger from './logger';

const port = app.get('port');
const server = app.listen(port);
const startTime = Date.now();

process.on('unhandledRejection', (reason, p) => {
    const message = ['UnhandeledRejection', p, reason].join(' ');
    logger.error(message);
});

server.on('listening', () => {
    logger.info('Feathers application started on http://%s:%d', app.get('host'), port);
    const duration = Date.now() - startTime;
    appInsights?.defaultClient?.trackMetric({name: 'Server startup time', value: duration});
});
