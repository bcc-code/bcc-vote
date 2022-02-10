import { NotFound, NotImplemented } from '@feathersjs/errors';
import { Id, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { db } from '../../firestore';

interface PollResultDetails {
    answerCount: Record<string, number>;
    lastChanged: number;
    pollId: string;
    pollingEventId: string;
}

const isPrimitive = (val: any): boolean => {
    if(val === Object(val))
        return false;
    return true;
};
export class PollResult implements Partial<ServiceMethods<PollResultDetails>> {
    app: Application;
    collection: FirebaseFirestore.CollectionReference;

    constructor (app: Application) {
        this.app = app;
        this.collection = db.collection('poll-result');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async create(data: PollResultDetails, params: Params):Promise<PollResultDetails> {
        await this.collection.doc(data.pollId).set(data);
        return data;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async update(id: string, data: PollResultDetails, params: Params):Promise<PollResultDetails> {
        await this.collection.doc(id).set(data);
        return data;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async find (params: Params): Promise<PollResultDetails[]> {
        const query = params.query;
        if(!query)
            return [];
        let resultRef = this.collection as FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;
        Object.keys(query).forEach((atr: string) => {
            if(isPrimitive(query[atr]))
                resultRef = resultRef.where(atr, '==', query[atr]);
            else
                throw new NotImplemented('That query is not yet implemented');
        });
        const resultArray:PollResultDetails[] = [];
        const querySnapshot = await resultRef.get();

        querySnapshot.forEach(doc => {
            const data = doc.data() as PollResultDetails;
            resultArray.push(data);
        });
        return resultArray;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async get (id: Id, params?: Params): Promise<PollResultDetails> {
        const resultRef = this.collection.doc(id.toString());
        
        const result = await resultRef.get();
        const data = result.data() as PollResultDetails | undefined;
        if(!data) throw new NotFound('Poll result not found');

        return data;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async patch (id: string, data: Partial<PollResultDetails>, params?: Params): Promise<PollResultDetails> {
        await this.collection.doc(id).update(data);
        const updatedPollResultSnapshot = await this.collection.doc(id).get();
        const updatedDocument = updatedPollResultSnapshot.data() as PollResultDetails | undefined;
        if(!updatedDocument) throw Error('Could not get the poll-result');
        return updatedDocument;
    }
}
