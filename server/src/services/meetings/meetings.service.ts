import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Meetings } from './meetings.class';
import createModel from '../../models/meetings.model';
import hooks from './meetings.hooks';

declare module '../../declarations' {
  interface ServiceTypes {
    'meetings': Meetings & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const Model = createModel(app);

  app.use('/meetings', new Meetings(Model, app));

  const service = app.service('meetings');
  service.hooks(hooks);
}
