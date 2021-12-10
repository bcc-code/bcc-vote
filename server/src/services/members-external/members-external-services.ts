import logger from '../../logger';
import { Application } from '../../declarations';
import socketio from '@feathersjs/socketio-client';
import { inspect } from 'util';
import feathers from '@feathersjs/feathers';
import rest from '@feathersjs/rest-client';
import axios from 'axios';
const io = require('socket.io-client');

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

    const membersWebSocketClient = feathers();

    membersWebSocketClient.configure(socketio(socket, {
        timeout: 4000
    }));

    app.use('/org', membersWebSocketClient.service('org'));
    app.use('/role', membersWebSocketClient.service('role'));

    const restClient = rest(url);
    const membersRestClient = feathers();
    membersRestClient.configure(restClient.axios(axios, {
        timeout: 5000,
        headers: {
            'x-access-token': membersConfig.apiKey,
        },
        errorHandler: function (error: any) {
            logger.error("Error while fetching data from members api.", {
                error: error,
                membersApiUrl: url,
            });
        }
    }));

    app.use('/person', membersRestClient.service('person'));

}
