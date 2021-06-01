import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { User } from './user.class';
import createModel from '../../models/users.model';
import hooks from './user.hooks';

declare module '../../declarations' {
  interface ServiceTypes {
    'user': User & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const Model = createModel(app);

  app.use('/user', new User(Model, app));

  const service = app.service('user');
  service.hooks(hooks);
}
