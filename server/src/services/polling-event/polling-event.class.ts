import { DbService, IOptions, } from "@bcc-code/feathers-arangodb";
import { Application } from '../../declarations';

interface Data {}

export class PollingEvent extends DbService<Data> {
  app: Application;

  constructor (options: IOptions, app: Application) {
    super(options);
    this.app = app;
  }
}