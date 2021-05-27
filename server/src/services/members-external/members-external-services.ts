import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import createModel from '../../models/meetings.model';
const rest = require('@feathersjs/rest-client');
const fetch = require('node-fetch');


export default function (app: Application): void {

  const membersConfig = app.get("members");


  const membersClient = rest(membersConfig.url).fetch(fetch,{
      headers: {
          'x-access-token': membersConfig.apiKey
        }
  });
  app.use('/person', membersClient.service('person'));
  app.use('/org', membersClient.service('org'));

}
