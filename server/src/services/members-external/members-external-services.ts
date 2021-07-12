import logger from '../../logger';
import { Application } from '../../declarations';
import socketio from '@feathersjs/socketio-client';
import { inspect } from 'util';
const io = require('socket.io-client');

import feathers from '@feathersjs/feathers';


export default function (app: Application): void {

    const membersConfig = app.get("members");
    
    const url = membersConfig.url;

    const socket = io(url, {
        transports:["websocket", "polling"],
        extraHeaders: {
            'x-access-token': membersConfig.apiKey
        }
    });


    socket.on("connect", () => {
        logger.info(`[SOCKET_EVENT] [VOTING_APP] [CONNECTED] socket successfully connected to ${url}`);
    });

    socket.on("disconnect", (reason: string) => {
        logger.info(`[SOCKET_EVENT] [VOTING_APP] [DISCONNECTED] socket was disconnected from ${url} for the following reason: ${reason}`);
    });

    socket.on("connect_error", (error: any) => {
        logger.error(`[SOCKET_EVENT] [VOTING_APP] [ERROR] socket failed to reconnect to ${url} after an reconnection attempt with the following error: ${inspect(error)}`);
    });

    const membersClient = feathers();

    membersClient.configure(socketio(socket, {
        timeout: 4000
    }));

    app.use('/person', membersClient.service('person'));
    app.use('/org', membersClient.service('org'));
    app.use('/role', membersClient.service('role'));
}
