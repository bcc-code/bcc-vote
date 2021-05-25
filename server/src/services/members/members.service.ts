import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Members } from './members.class';
import hooks from './members.hooks';

declare module '../../declarations' {
  interface ServiceTypes {
    'members': Members & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  app.use('/members', new Members(options, app));

  const service = app.service('members');

  service.hooks(hooks);
}
