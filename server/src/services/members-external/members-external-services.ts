import logger from '../../logger';
import { Application } from '../../declarations';
const socketio = require('@feathersjs/socketio-client');
const io = require('socket.io-client');

import feathers from '@feathersjs/feathers';


export default function (app: Application): void {

    const membersConfig = app.get("members");

    const socket = io(membersConfig.url, {
        transports:["websocket", "polling"],
        extraHeaders: {
            'x-access-token': membersConfig.apiKey
        }
    });

    socket.on("connect", () => {
        logger.info('Members socket connected');
    });

    socket.on("disconnect", () => {
        logger.info('Members socket disconnected');
    });

    socket.on("connect_error", () => {
        logger.info('Members socket connection error');
    });

    const membersClient = feathers()

    membersClient.configure(socketio(socket, {
        timeout: 4000
    }));

    app.use('/person', membersClient.service('person'));
    app.use('/org', membersClient.service('org'));
    app.use('/role', membersClient.service('role'));
}
