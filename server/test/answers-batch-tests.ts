import 'mocha';
import app from '../src/app';
import { assert } from 'chai';
import { getAranoDBConfigFromFeathers, pollingEventsTestSet }  from './setup-tests/test-set';
import { Answer, PollingEventAnswerBatch, User } from '../src/domain';
import { importDB} from "@bcc-code/arango-migrate";
import { Params } from '@feathersjs/feathers';
import { PollActiveStatus } from '../src/domain/Poll';
import { sleep } from '../src/utils/promise';

function getAnswerInBatches(answer: Answer, batch: PollingEventAnswerBatch) {
    const {_id, pollingEventId} = answer;
    if(batch.pollingEventId !== pollingEventId) {
        return undefined;
    }
    return batch.answers.find(a => a._id === _id);
}

describe('Answer batching', async () => {
    let testSet:any;
    let poll:any;
    let user:User;
    let answer:Partial<Answer>;

    const generateAnswerAndParams= (user_key: number):[Partial<Answer>, Params] => {
        const answerUser = {
            ...user,
            _key: String(user_key),
            displayName: `User ${user_key}`,
            activeRole: 'Member',
        };
    
        return [
            {...answer, _to: `person/${user_key}`},
            { user: answerUser}
        ];
    };

    beforeEach(async ()=>{
        await importDB(getAranoDBConfigFromFeathers(),true,false);
        testSet = pollingEventsTestSet();
        app.services['answer-batch'].resetBatchState();

        poll = await (testSet['basePoll'])() as any;
        user = await (testSet['user'])();
        user.churchName = 'Terwolde';
        answer = {
            _from: poll._id,
            _to: user._id,
            answerId: '122131232',
            pollingEventId: poll.pollingEventId
        };
    });

    it('Created answer -> Gets added to batch', async () => {
        try {
            const batches:PollingEventAnswerBatch[]  = [];
            app.services.answer.on('batched',(batch: PollingEventAnswerBatch) => {
                batches.push(batch);
            });

            await app.services.poll.patch(poll._key,{activeStatus: PollActiveStatus.Live},{});
            const created = await app.services.answer.create(...generateAnswerAndParams(1));

            await sleep(1005);
            const firstBatch = batches[0];
            const answerInBatch = getAnswerInBatches(created, firstBatch);

            assert.isDefined(answerInBatch);
            assert.equal(answerInBatch?.displayName, 'User 1');
        } catch (error) {
            assert.fail(error.message);
        }
    });

    it('Created answer -> After batching an answer it is not included in the following batch', async () => {
        try {
            const batches:PollingEventAnswerBatch[]  = [];
            app.services.answer.on('batched',(batch: PollingEventAnswerBatch) => {
                batches.push(batch);
            });

            await app.services.poll.patch(poll._key,{activeStatus: PollActiveStatus.Live},{});
            const created = await app.services.answer.create(...generateAnswerAndParams(1));

            await sleep(1005);
            const answerBatch1 = batches[0];
            const answerInBatch1 = getAnswerInBatches(created, answerBatch1);
            assert.isDefined(answerInBatch1);

            await sleep(1005);
            const answerBatch2 = batches[1];
            let answerInBatch2;
            if(answerBatch2) {
                answerInBatch2 = getAnswerInBatches(created, answerBatch2);
            }
            assert.isUndefined(answerInBatch2);
        } catch (error) {
            assert.fail(error.message);
        }
    });

    it('Created answer -> Batching multiple answers it is not included in the following batch', async () => {
        try {
            const batches:PollingEventAnswerBatch[]  = [];
            app.services.answer.on('batched',(batch: PollingEventAnswerBatch) => {
                batches.push(batch);
            });

            await app.services.poll.patch(poll._key,{activeStatus: PollActiveStatus.Live},{});
            const answers1 = [
                app.services.answer.create(...generateAnswerAndParams(1)),
                app.services.answer.create(...generateAnswerAndParams(2)),
                app.services.answer.create(...generateAnswerAndParams(3)),
            ];
            await Promise.all(answers1);

            await sleep(1005);
            assert.equal(batches[0]?.pollingEventId, poll.pollingEventId);
            assert.isDefined(batches[0]?.answers.find(a => a._to === 'person/1'));
            assert.isDefined(batches[0]?.answers.find(a => a._to === 'person/2'));
            assert.isDefined(batches[0]?.answers.find(a => a._to === 'person/3'));

            const answers2 = [
                app.services.answer.create(...generateAnswerAndParams(4)),
                app.services.answer.create(...generateAnswerAndParams(5)),
            ];
            await Promise.all(answers2);

            await sleep(1005);
            assert.equal(batches[1]?.pollingEventId, poll.pollingEventId);
            assert.isUndefined(batches[1]?.answers.find(a => a._to === 'person/1'));
            assert.isUndefined(batches[1]?.answers.find(a => a._to === 'person/2'));
            assert.isUndefined(batches[1]?.answers.find(a => a._to === 'person/3'));
            assert.isDefined(batches[1]?.answers.find(a => a._to === 'person/4'));
            assert.isDefined(batches[1]?.answers.find(a => a._to === 'person/5'));
        } catch (error) {
            assert.fail(error.message);
        }
    });

    it('Created answer -> Reactivating a poll allows answer to be batched again', async () => {
        try {
            const batches:PollingEventAnswerBatch[]  = [];
            app.services.answer.on('batched',(batch: PollingEventAnswerBatch) => {
                batches.push(batch);
            });

            await app.services.poll.patch(poll._key,{activeStatus: PollActiveStatus.Live},{});
            const created1 = await app.services.answer.create(...generateAnswerAndParams(1));

            
            await sleep(1005);
            const answerBatch1 = batches[0];
            const answerInBatch1 = getAnswerInBatches(created1, answerBatch1);
            assert.isDefined(answerInBatch1);

            //Republish poll
            await app.services.poll.patch(poll._key,{activeStatus: PollActiveStatus.Finished},{});
            await app.services.poll.patch(poll._key,{activeStatus: PollActiveStatus.Live},{});
            const created2 = await app.services.answer.create(...generateAnswerAndParams(1));

            
            await sleep(1005);
            const answerBatch2 = batches[1];
            const answerInBatch2 = getAnswerInBatches(created2, answerBatch2);
            assert.isDefined(answerInBatch2);
        } catch (error) {
            assert.fail(error.message);
        }
    });
});
