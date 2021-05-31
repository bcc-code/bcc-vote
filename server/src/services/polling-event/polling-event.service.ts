import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { PollingEvent } from './polling-event.class';
import createModel from '../../models/polling-event.model';
import hooks from './polling-event.hooks';

declare module '../../declarations' {
  interface ServiceTypes {
    'polling-event': PollingEvent & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const Model = createModel(app);

  app.use('/polling-event', new PollingEvent(Model, app));

  const service = app.service('polling-event');
  service.hooks(hooks);
}
