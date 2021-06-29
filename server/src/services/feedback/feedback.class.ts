import { NotImplemented } from '@feathersjs/errors';
import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { FieldValue } from "@google-cloud/firestore";
import { Application } from '../../declarations';
import { db } from '../../firestore';
import axios from "axios";

interface Data {
    pollingEventId: string,
    personID: string,
    rating: number,
    message?: string
}

const possibleRatings = [1, 2, 3, 4, 5];

const updateRating = async(rating: number, eventId: string):Promise<void> => {
    if(!possibleRatings.includes(rating))
        return;
        
    const eventRef = db.collection('feedback').doc(eventId); 
    const countUpdate = {} as any;
    countUpdate[rating] = FieldValue.increment(1);
    await eventRef.update(countUpdate);
};

interface ServiceOptions {}

export class Feedback implements ServiceMethods<Data> {
    app: Application;
    options: ServiceOptions;

    constructor (options: ServiceOptions = {}, app: Application) {
        this.options = options;
        this.app = app;
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.defaults.baseURL = process.env.VOTE_FEEDBACK_ENDPOINT;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async find (params: Params): Promise<Data[] | Paginated<Data>> {
        throw new NotImplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async get (id: Id, params?: Params): Promise<Data> {
        throw new NotImplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async create (data: Data, params?: Params): Promise<Data> {
        const promises = [] as Array<Promise<any>>;
        console.log('creating');
        console.log(data.message);
        console.log(process.env.NODE_ENV);

        if(data.message){
            const toSend = {
                pollingEventId: data.pollingEventId,
                personID: data.personID,
                message: data.message
            };
            console.log('sending: ', toSend);
            // promises.push(axios.post('', toSend));
        }
        
        promises.push(updateRating(data.rating, data.pollingEventId));
        await Promise.all(promises);

        return data;
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
