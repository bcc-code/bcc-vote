// Initializes the `person` service on path `/person`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Votings } from './votings.class';
import createModel from "../../models/votings.model";
import hooks from './votings.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'votings': Votings & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const Model = createModel(app);

  // Initialize our service with any options it requires
  app.use('/votings', new Votings(Model, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('votings');

  service.hooks(hooks);
}
