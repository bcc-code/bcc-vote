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

    constructor (app: Application) {
        this.app = app;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async find (params: Params): Promise<PollResultDetails[]> {
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
        const resultRef = db.collection('poll-result').doc(id.toString());
        
        const result = await resultRef.get();
        const data = result.data() as PollResultDetails | undefined;
        if(!data) throw new NotFound('Poll result not found');

        return data;
    }
}
