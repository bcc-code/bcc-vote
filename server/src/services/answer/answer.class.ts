import { DbService, IOptions, } from "@bcc-its/feathers-arangodb";
import { Application } from '../../declarations';
// import { NotImplemented } from '@feathersjs/errors';

interface Data {}

export class Answer extends DbService<Data> {
    app: Application;

    constructor (options: IOptions, app: Application) {
        super(options);
        this.app = app;
    }
}
