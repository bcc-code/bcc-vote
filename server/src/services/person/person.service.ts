// Initializes the `person` service on path `/person`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Person } from './person.class';
import hooks from './person.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'person': Person & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/person', new Person(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('person');

  service.hooks(hooks);
}
