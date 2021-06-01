// Initializes the `meetings` service on path `/meetings`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Poll } from './poll.class';
import createModel from '../../models/poll.model';
import hooks from './poll.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'poll': Poll & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const Model = createModel(app);

  // Initialize our service with any options it requires
  app.use('/poll', new Poll(Model, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('poll');
  service.hooks(hooks);
}
