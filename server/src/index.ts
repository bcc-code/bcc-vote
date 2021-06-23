import logger from './logger';
import app from './app';

const port = app.get('port');
const server = app.listen(port);

process.on('unhandledRejection', (reason, p) => {
    const message = ['UnhandeledRejection', p, reason].join(' ');
    logger.error(message);
});

server.on('listening', () =>
    logger.info('listening')
);
