// Initializes the `poll-result` service on path `/poll-result`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { PollResult } from './poll-result.class';
import hooks from './poll-result.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'poll-result': PollResult & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/poll-result', new PollResult(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('poll-result');

  service.hooks(hooks);
}
