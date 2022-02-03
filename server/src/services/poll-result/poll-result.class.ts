import { NotFound, NotImplemented } from '@feathersjs/errors';
import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { QuerySnapshot } from "@google-cloud/firestore";
import { Application } from '../../declarations';
import { db } from '../../firestore';

interface Data {}

interface ServiceOptions {}

const isPrimitive = (val: any): boolean => {
    if(val === Object(val))
        return false;
    return true;
};
export class PollResult implements ServiceMethods<Data> {
    app: Application;
    options: ServiceOptions;

    constructor (options: ServiceOptions = {}, app: Application) {
        this.options = options;
        this.app = app;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async find (params: Params): Promise<Data[] | Paginated<Data>> {
        const query = params.query;
        if(!query)
            return [];
        let resultRef = db.collection('poll-result') as FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;
        Object.keys(query).forEach((atr: string) => {
            if(isPrimitive(query[atr]))
                resultRef = resultRef.where(atr, '==', query[atr]);
            else
                throw new NotImplemented('That query is not yet implemented');
        });
        const resultArray = [] as Array<PollResult>;
        const querySnapshot = await resultRef.get() as QuerySnapshot;

        querySnapshot.forEach((doc: any) => {
            const data = doc.data() as PollResult;
            resultArray.push(data);
        });
        return resultArray;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async get (id: Id, params?: Params): Promise<Data> {
        const resultRef = db.collection('poll-result').doc(id.toString());
        
        const result = await resultRef.get();
        const data = result.data();
        if(!data) throw new NotFound('Poll result not found');

        return data;
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
