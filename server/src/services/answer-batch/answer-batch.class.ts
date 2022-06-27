import { Application } from '../../declarations';
import { ServiceMethods, Params } from '@feathersjs/feathers';
import { Answer, PollingEventAnswerBatch } from "../../domain";
import {instanceLogger} from '../../logger';

export class AnswerBatch implements Partial<ServiceMethods<any>> {
    app: Application;
    lastBatchDate: number;
    previouslyBatchedAnswerIds: string[];

    constructor (app: Application) {
        this.app = app;
        this.lastBatchDate = 0;
        this.previouslyBatchedAnswerIds = [];
    }

    async create (data: any, params?: Params): Promise<PollingEventAnswerBatch[]> {
        const logger = await instanceLogger();
        const compensationMs = 300;
        const batchRange = this.lastBatchDate - compensationMs;

        const query = {
            lastChanged: { $gt: batchRange}
        };
        const answers = await this.app.services.answer.find({query});

        
        const filteredAnswers = answers.filter((a) => !this.previouslyBatchedAnswerIds.includes(a._id));
        const sortedAnswers = filteredAnswers.sort((a, b) => b.lastChanged - a.lastChanged);
        if(sortedAnswers[0]) {
            this.lastBatchDate = sortedAnswers[0].lastChanged;
        }

        const answerBatches = mapAnswersToBatches(sortedAnswers);
        answerBatches.forEach(batch => {
            const answers = batch.answers; 
            const batchRanges:number[] = [];
            if(answers.length) {
                batchRanges.push(answers[0].lastChanged);
                batchRanges.push(answers[answers.length - 1].lastChanged);
            }
            logger.info(`Batched ${answers.length} answers`, { range: batchRanges});
            this.app.service('answer').emit('batched', batch);
        });

        const answerIds = filteredAnswers.map(a => a._id);
        this.previouslyBatchedAnswerIds.push(...answerIds);
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
