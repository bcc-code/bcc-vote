import { Application } from '../../declarations';
import { ServiceMethods, Params, Id } from '@feathersjs/feathers';
import { Answer, PollingEventAnswerBatch } from "../../domain";
import logger from '../../logger';
import schedule from '../../schedule';

interface BatchedPerPoll {
    [key: string]: string[]
}

export class AnswerBatch implements Partial<ServiceMethods<any>> {
    app: Application;
    activePoll_Ids: string[];
    batchedPerPoll: BatchedPerPoll;

    constructor (app: Application) {
        this.app = app;
        this.activePoll_Ids = [];
        this.batchedPerPoll = {};
    }

    async create (data: any, params?: Params): Promise<PollingEventAnswerBatch[]> {
        const query = {
            _from: {$in: this.activePoll_Ids},
        };
        const answers = await this.app.services.answer.find({query});

        const sortedAnswers = answers.sort((a, b) => b.lastChanged - a.lastChanged);
        const filteredAnswers = this.filterOutPreviousAnswers(sortedAnswers);
        const answerBatches = this.mapAnswersToBatches(filteredAnswers);

        answerBatches.forEach(batch => {
            logger.info(`Batched ${answers.length} answers`);
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

            deactivate.forEach((poll_id:string) => {
                delete this.batchedPerPoll[poll_id];
            });
        }

        if(schedulerActive && this.activePoll_Ids.length === 0) {
            schedule.stop();
        }
        if(!schedulerActive && this.activePoll_Ids.length) {
            schedule.start();
        }
        return this.activePoll_Ids;
    }

    getBatchState() {
        return { activePoll_Ids: this.activePoll_Ids, batchedPerPoll: this.batchedPerPoll};
    }

    resetBatchState() {
        this.activePoll_Ids = [];
        this.batchedPerPoll = {};
    }

    filterOutPreviousAnswers(answers: Answer[]) {
        const previouslyBatchedAnswers:string[] = [];
        for (const poll_id of Object.keys(this.batchedPerPoll)) {
            previouslyBatchedAnswers.push(...this.batchedPerPoll[poll_id]);
        }

        const filteredAnswers = answers.filter(a => !previouslyBatchedAnswers.includes(a._id));
        filteredAnswers.forEach(a => {
            if(this.batchedPerPoll[a._from]) {
                this.batchedPerPoll[a._from].push(a._id);
            } else {
                this.batchedPerPoll[a._from] = [a._id];
            }
        });
    
        return filteredAnswers;
    }

    mapAnswersToBatches(answers: Answer[]) {
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
}
