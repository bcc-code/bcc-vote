// Initializes the `meetings` service on path `/meetings`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Answer } from './answer.class';
import createModel from '../../models/answer.model';
import hooks from './answer.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'answer': Answer & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
    const Model = createModel(app);

    // Initialize our service with any options it requires
    app.use('/answer', new Answer(Model, app));

    // Get our initialized service so that we can register hooks
    const service = app.service('answer');
    service.hooks(hooks);
}
