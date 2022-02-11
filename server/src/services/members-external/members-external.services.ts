import logger from '../../logger';
import { Application } from '../../declarations';
import rest from '@feathersjs/rest-client';
import axios from 'axios';
import feathers, { ServiceAddons } from '@feathersjs/feathers';
import { ExternalService } from './members-external.class';
import { User, Role } from '../../domain';

declare module '../../declarations' {
    interface ServiceTypes {
      'person': ExternalService<User> & ServiceAddons<any>;
      'org': ExternalService<any> & ServiceAddons<any>;
      'role': ExternalService<Role> & ServiceAddons<any>;
    }
  }
  

export default function (app: Application): void {

    const membersConfig = app.get("members");

    const url = membersConfig.url;


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

    app.use('/person', new ExternalService<User>(membersRestClient, 'person'));
    app.use('/org', new ExternalService<any>(membersRestClient, 'org'));
    app.use('/role', new ExternalService<Role>(membersRestClient, 'role'));
}
