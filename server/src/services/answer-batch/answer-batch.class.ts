import { IOptions } from "@bcc-code/feathers-arangodb";
import { Application } from '../../declarations';
import { ServiceMethods, Params } from '@feathersjs/feathers';
import { Answer, PollingEventAnswerBatch } from "../../domain";

export class AnswerBatch implements Partial<ServiceMethods<any>> {
    app: Application;
    lastBatchDate: number;

    constructor (app: Application) {
        this.app = app;
        this.lastBatchDate = 0;
    }

    async create (data: any, params?: Params): Promise<PollingEventAnswerBatch[]> {
        const dateOfBatch = Date.now();

        const query = {
            lastChanged: { $gte: this.lastBatchDate}
        };
        const answers = await this.app.services.answer.find({query});
        this.lastBatchDate = dateOfBatch;

        const answerBatches = mapAnswersToBatches(answers);
        answerBatches.forEach(batch => {
            this.app.service('answer').emit('batched', batch);
        });
        return answerBatches;
    }
}

function mapAnswersToBatches(answers: Answer[]) {
    const eventBatches:PollingEventAnswerBatch[] = [];
    answers.forEach(answer => {
        const {pollingEventId} = answer;
        const existingBatch = eventBatches.find(b => b.pollingEventId == pollingEventId);

        if (existingBatch) {
            existingBatch.answers.push(answer);
        } else {
            eventBatches.push({
                pollingEventId,
                answers: [answer]
            });
        } 
    });

    return eventBatches;
}
