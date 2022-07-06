import 'mocha';
import { assert } from 'chai';
import app from '../src/app';
import { generateFreshContext, getAranoDBConfigFromFeathers }  from './setup-tests/test-set';
import {PollingEventAnswerBatch, PollActiveStatus, Answer, User} from '../src/domain';
import { importDB } from '@bcc-code/arango-migrate';
import { sleep } from '../src/utils/promise';

describe('channels', () => {
    let context:any;
    let user: User;
    let answer: Partial<Answer>;
    const pollingEventId = '504279890';

    beforeEach(async() => {
        await importDB(getAranoDBConfigFromFeathers(),true,false);
        app.services['answer-batch'].resetBatchState();
        context  = await generateFreshContext();
        context.params.provider = '';
        user = context.params.user;
        answer = {
            _from: 'poll/504310092',
            _to: user._id,
            answerId: '1',
            pollingEventId ,
        };

        // person id added to a channel by getting polling event
        await app.service('polling-event').get(pollingEventId, context.params);
    });

    afterEach(function() {
        app.channel('504279890').connections = [];
        //server.close(done);
    });

    it('Check if user got added to the channel', async () => {
        try {
            assert.equal(context.params.connection, app.channel('504279890').connections[0]);
        } catch (error) {
            assert.fail('There should be no error. Error:',error);
        }

    });
    it('Get data via socket -> poll patched', async () => {
        try {
            let res:any;
            context.app.service('poll').on('patched', (poll:any)=>{ 
                if(poll.pollingEventId === app.channels[0])
                    res = poll;
            });
            await app.service('poll').patch('504310091', {
                activeStatus: 'not_started',
            }, context.params);

            // Assert
            assert.equal(res._key,'504310091');
            assert.equal(res.activeStatus,'not_started');
        } catch (error) {
            assert.fail('There should be no error. Error:',error);
        }
    });

    it('Answer batching stays up to date -> poll activated and finished', async () => {
        try {
            const activatedPoll = { _id: 'poll/12345678', activeStatus: PollActiveStatus.Live};
            app.service('poll').emit('patched', activatedPoll);
            await sleep(500);
            const batchState1 = app.services['answer-batch'].getBatchState();
            assert.include(batchState1.activePoll_Ids, activatedPoll._id);

            const finishedPoll = Object.assign(activatedPoll, {activeStatus: PollActiveStatus.Finished});
            app.service('poll').emit('patched', finishedPoll);
            await sleep(500);
            const batchState2 = app.services['answer-batch'].getBatchState();
            assert.notInclude(batchState2.activePoll_Ids, activatedPoll._id);
        } catch (error) {
            assert.fail(error);
        }
    });

    it('Get data via socket -> polling event patched', async () => {
        try {
            // Act
            let res:any;
            context.app.service('polling-event').on('patched', (pollingEvent:any)=>{ 
                if(pollingEvent._key === app.channels[0])
                    res = pollingEvent;
            });
            await app.service('polling-event').patch('504279890', {
                status: 'live',
            }, context.params);
            
            // Assert
            assert.equal(res._key, '504279890');
            assert.equal(res.status, 'live');
        } catch (error) {
            assert.fail('There should be no error. Error:',error);
        }
    });

    it('different polling event gets patched', async () => {
        try {
            // Act
            let res:any;
            context.app.service('polling-event').on('patched', (pollingEvent:any)=>{ 
                if(pollingEvent._key === app.channels[0])
                    res = pollingEvent;
            });
            await app.service('polling-event').patch('504306892', {
                status: 'finished',
            }, context.params);
            
            // Assert
            assert.equal(res, undefined);
        } catch (error) {
            assert.fail('There should be no error. Error:',error);
        }
    });

    it('poll from different polling event gets patched', async () => {
        try {
            let res:any;
            context.app.service('poll').on('patched', (poll:any)=>{ 
                if(poll.pollingEventId === app.channels[0])
                    res = poll;
            });
            await app.service('poll').patch('504310091', {
                activeStatus: 'not_started',
            }, context.params);
            // Assert
            assert.equal(res._key,'504310091');
            assert.equal(res.activeStatus,'not_started');
        } catch (error) {
            assert.fail('There should be no error. Error:',error);
        }
    });

    it('Answer to poll gets batched through', async () => {
        try {
            await app.services.poll.patch('504310092', { activeStatus: PollActiveStatus['Live'] }, {});
            let batch;
            context.app.service('answer').on('batched', (answerBatch:PollingEventAnswerBatch)=>{
                batch = answerBatch;
            });

            const createdAnswer = await app.services.answer.create(answer,{user});
            await sleep(2500);
            assert.isDefined(batch);
            assert.equal(batch.pollingEventId, pollingEventId);
            assert.equal(batch.answers.length, 1);
            assert.equal(batch.answers[0]._id, createdAnswer._id);
        } catch (error) {
            assert.fail(error);
        }
    });
});
