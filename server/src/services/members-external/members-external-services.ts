import logger from '../../logger';
import { Application } from '../../declarations';
import feathers from '@feathersjs/feathers';
import rest from '@feathersjs/rest-client';
import axios from 'axios';

export default function (app: Application): void {

    const membersConfig = app.get("members");

    const url = membersConfig.url;

    const membersClient = feathers();
    const restClient = rest(url);

    membersClient.configure(restClient.axios(axios, {
        timeout: 5000,
        headers: {
            'x-access-token': membersConfig.apiKey,
        },
        errorHandler: function (error: any) {
            logger.error(error);
        }
    }));

    app.use('/person', membersClient.service('person'));
    app.use('/org', membersClient.service('org'));
    app.use('/role', membersClient.service('role'));
}
