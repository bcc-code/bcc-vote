import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Users } from './users.class';
import createModel from '../../models/users.model';
import hooks from './users.hooks';

declare module '../../declarations' {
  interface ServiceTypes {
    'users': Users & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const Model = createModel(app);

  app.use('/users', new Users(Model, app));

  const service = app.service('users');
  service.hooks(hooks);
}
