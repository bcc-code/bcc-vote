import { DbService, IOptions, } from "@bcc-code/feathers-arangodb";
import { Id, Params } from "@feathersjs/feathers";
import { Application } from '../../declarations';
import { Answer as AnswerDetails } from "../../domain";

export class Answer extends DbService<any> {
    app: Application;

    constructor (options: IOptions, app: Application) {
        super(options);
        this.events = ['batched'];
        this.app = app;
    }

    async get(id: Id, params: Params):Promise<AnswerDetails> {
        return super.get(id, params);
    }

    async find(params: Params):Promise<AnswerDetails[]> {
        return await super.find(params) as AnswerDetails[];
    }
    
    async patch(id: Id, data: any,params: Params):Promise<AnswerDetails> {
        return super.patch(id, data, params);
    }

    async create(data: any, params: Params):Promise<AnswerDetails> {
        return super.create(data, params);
    }

    async remove(id: Id, params: Params):Promise<AnswerDetails> {
        return super.remove(id, params);
    }

}
