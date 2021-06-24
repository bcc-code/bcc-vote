import app from './app';
import logger from './logger';

const port = app.get('port');
const server = app.listen(port);

process.on('unhandledRejection', (reason, p) => {
    const message = ['UnhandeledRejection', p, reason].join(' ');
    logger.error(message);
});

server.on('listening', () =>
    logger.info('Feathers application started on http://%s:%d', app.get('host'), port)
);
