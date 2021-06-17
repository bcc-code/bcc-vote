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

    async find (params: Params): Promise<Data[] | Paginated<Data>> {
        const query = params.query;
        if(!query)
            return [];
        let answersRef = db.collection('answer');
        Object.keys(query).forEach((atr: string) => {
            if(isPrimitive(query[atr]))
                answersRef = answersRef.where(atr, '==', query[atr]);
            else
                throw new NotImplemented('That query is not yet implemented');
        });
        const answerArray = [] as Array<Answer>;
        const querySnapshot = await answersRef.get() as QuerySnapshot;

        querySnapshot.forEach((doc) => {
            const data = doc.data() as Answer;
            answerArray.push(data);
        });
        return answerArray;
    }
    async get (id: Id, params?: Params): Promise<Data> {
        console.log('getting answer');
        console.log(id);
        const answerRef = db.collection('answer').doc(id);
        
        const result = await answerRef.get();
        return result.data();
    }
}
