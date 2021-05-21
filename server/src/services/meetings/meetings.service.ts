// Initializes the `meetings` service on path `/meetings`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Meetings } from './meetings.class';
import createModel from '../../models/meetings.model';
import hooks from './meetings.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'meetings': Meetings & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const Model = createModel(app);

  // Initialize our service with any options it requires
  app.use('/meetings', new Meetings(Model, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('meetings');
  service.hooks(hooks);
}
