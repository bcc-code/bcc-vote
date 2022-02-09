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
    app.use('/poll-result', new PollResult(app));
    const service = app.service('poll-result');

    service.hooks(hooks);
}
