// Initializes the `meetings` service on path `/meetings`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Questions } from './questions.class';
import createModel from '../../models/questions.model';
import hooks from './questions.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'questions': Questions & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const Model = createModel(app);

  // Initialize our service with any options it requires
  app.use('/questions', new Questions(Model, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('questions');
  service.hooks(hooks);
}
