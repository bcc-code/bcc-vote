// Initializes the `meetings` service on path `/meetings`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Participant } from './participant.class';
import createModel from '../../models/answer.model';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    participant: Participant & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const Model = createModel(app);

  // Initialize our service with any options it requires
  app.use('/participant', new Participant(Model, app));
}
