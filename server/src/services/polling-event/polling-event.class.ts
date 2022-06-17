import { DbService, IOptions, } from "@bcc-code/feathers-arangodb";
import { PollingEvent as PollingEventDetails } from "../../domain";
import { Application } from '../../declarations';
import { Id, Params } from "@feathersjs/feathers";

export class PollingEvent extends DbService<any> {
    app: Application;

    constructor (options: IOptions, app: Application) {
        super(options);
        this.app = app;
    }

    async get(id: Id, params: Params):Promise<PollingEventDetails> {
        return super.get(id, params);
    }

    async find(params: Params):Promise<PollingEventDetails[]> {
        return await super.find(params) as PollingEventDetails[];
    }

    async patch(id: Id, data: any,params: Params):Promise<PollingEventDetails> {
        return super.patch(id, data, params);
    }

    async create(data: any, params: Params):Promise<PollingEventDetails> {
        return super.create(data, params);
    }

    async remove(id: Id, params: Params):Promise<PollingEventDetails> {
        return super.remove(id, params);
    }
}