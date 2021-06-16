import { DbService, IOptions, } from "@bcc-its/feathers-arangodb";
import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { QuerySnapshot } from "@google-cloud/firestore";
import { Application } from '../../declarations';
import { db } from '../../firestore';
// import { NotImplemented } from '@feathersjs/errors';

interface Data {}

export class Answer extends DbService<Data> {
    app: Application;

    constructor (options: IOptions, app: Application) {
        super(options);
        this.app = app;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async find (params: Params): Promise<Data[] | Paginated<Data>> {
        const query = params.query;
        if(!query)
            return [];
        let answersRef = db.collection('answer');
        Object.keys(query).forEach((atr: string) => {
            answersRef = answersRef.where(atr, '==', query[atr]);
        });
        const answerArray = [] as Array<Answer>;
        const querySnapshot = await answersRef.get() as QuerySnapshot;

        querySnapshot.forEach((doc) => {
            const data = doc.data() as Answer;
            answerArray.push(data);
        });
        return answerArray;
    }
}
