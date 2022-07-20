import { DbService, IOptions, } from "@bcc-code/feathers-arangodb";
import { Id, Params } from "@feathersjs/feathers";
import { Application } from '../../declarations';
import { Poll as PollDetails } from "../../domain";

export class Poll extends DbService<any> {
    app: Application;

    constructor (options: IOptions, app: Application) {
        super(options);
        this.app = app;
    }

    async get(id: Id, params: Params):Promise<PollDetails> {
        return super.get(id, params);
    }

    async find(params: Params):Promise<PollDetails[]> {
        return await super.find(params) as PollDetails[];
    }

    async patch(id: Id, data: any,params: Params):Promise<PollDetails> {
        return super.patch(id, data, params);
    }

    async create(data: any, params: Params):Promise<PollDetails> {
        return super.create(data, params);
    }

    async remove(id: Id, params: Params):Promise<PollDetails> {
        return super.remove(id, params);
    }
}