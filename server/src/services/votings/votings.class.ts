import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { DbService, IOptions, } from "@bcc-its/feathers-arangodb";
import { Application } from '../../declarations';

interface Data {}

export class Votings extends DbService<Data> {
  app: Application;

  constructor (options: IOptions, app: Application) {
    super(options)
    this.app = app;
  }
}