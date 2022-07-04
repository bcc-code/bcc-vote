import { Application } from '../../declarations';
import { ServiceMethods, Params, Id } from '@feathersjs/feathers';
import { Answer, PollingEventAnswerBatch } from "../../domain";
import logger from '../../logger';
import schedule from '../../schedule';

export class AnswerBatch implements Partial<ServiceMethods<any>> {
    app: Application;
    lastBatchDate: number;
    activePoll_Ids: string[];

    constructor (app: Application) {
        this.app = app;
        this.lastBatchDate = 0;
        this.activePoll_Ids = [];
    }

    async create (data: any, params?: Params): Promise<PollingEventAnswerBatch[]> {
        const compensationMs = 300;
        const batchRange = this.lastBatchDate - compensationMs;

        const query = {
            _from: {$in: this.activePoll_Ids},
            lastChanged: { $gt: batchRange}
        };
        logger.info(`Answer batch query ${JSON.stringify(query)}`);

        const answers = await this.app.services.answer.find({query});
        const sortedAnswers = answers.sort((a, b) => b.lastChanged - a.lastChanged);
        if(sortedAnswers[0]) {
            this.lastBatchDate = Date.now();
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
        return answerBatches;
    }

    async patch(id:Id, data:any, params:Params) {
        let schedulerActive = false;
        if(this.activePoll_Ids.length) {
            schedulerActive = true;
        }
        const {activate, deactivate} = data;
        if(!activate && !deactivate) {
            throw Error('No polls to activate or deactivate batching for defined');
        }
        if(activate?.length) {
            const previouslyInactive = activate.filter((a:string) => !this.activePoll_Ids.includes(a));
            this.activePoll_Ids.push(...previouslyInactive);
        }
        if(deactivate?.length) {
            const stillActive = this.activePoll_Ids.filter(a => !deactivate.includes(a));
            this.activePoll_Ids = stillActive;
        }

        if(schedulerActive && this.activePoll_Ids.length === 0) {
            schedule.stop();
        }
        if(!schedulerActive && this.activePoll_Ids.length) {
            schedule.start();
        }
        return this.activePoll_Ids;
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
