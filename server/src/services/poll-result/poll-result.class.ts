import { NotImplemented } from '@feathersjs/errors';
import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { db } from '../../firestore';

interface Data {}

interface ServiceOptions {}

export class PollResult implements ServiceMethods<Data> {
    app: Application;
    options: ServiceOptions;

    constructor (options: ServiceOptions = {}, app: Application) {
        this.options = options;
        this.app = app;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async find (params?: Params): Promise<Data[] | Paginated<Data>> {
        throw new NotImplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async get (id: Id, params?: Params): Promise<Data> {
        const resultRef = db.collection('poll-result').doc(id);
        
        const result = await resultRef.get();
        return result.data();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async create (data: Data, params?: Params): Promise<Data> {
        throw new NotImplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async update (id: NullableId, data: Data, params?: Params): Promise<Data> {
        throw new NotImplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async patch (id: NullableId, data: Data, params?: Params): Promise<Data> {
        throw new NotImplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async remove (id: NullableId, params?: Params): Promise<Data> {
        throw new NotImplemented();
    }
}
