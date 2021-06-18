import { DbService, IOptions, } from "@bcc-its/feathers-arangodb";
import { NotImplemented } from "@feathersjs/errors";
import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { QuerySnapshot } from "@google-cloud/firestore";
import { Application } from '../../declarations';
import { db } from '../../firestore';
// import { NotImplemented } from '@feathersjs/errors';

interface Data {}

const isPrimitive = (val: any): boolean => {
    if(val === Object(val))
        return false;
    return true;
};

export class Answer extends DbService<Data> {
    app: Application;

    constructor (options: IOptions, app: Application) {
        super(options);
        this.app = app;
    }
}
