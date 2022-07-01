import 'mocha';
import { assert } from 'chai';
import app from '../src/app';
import { getAranoDBConfigFromFeathers, pollingEventsTestSet }  from './setup-tests/test-set';
import { Answer, PollingEventAnswerBatch, User } from '../src/domain';
import { importDB} from "@bcc-code/arango-migrate";
import { Params } from '@feathersjs/feathers';
import logger from '../src/logger';

function getAnswerInBatches(answer: Answer, batches: PollingEventAnswerBatch[]) {
    const {_id, pollingEventId} = answer;
    const batch = batches.find(b => b.pollingEventId === pollingEventId);
    return batch?.answers.find(a => a._id === _id);
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

    it('Created answer -> Batched as a part of the Answer Batch', async () => {
        try {
            const created = await app.services.answer.create(answer,{ user});

            const answerBatches = await app.services['answer-batch'].create({},{});

            const answerInBatch = getAnswerInBatches(created, answerBatches);
            assert.isDefined(answerInBatch);
            assert.equal(answerInBatch?.displayName, user.displayName);
        } catch (error) {
            assert.fail(error.message);
        }
    });

    it('Created answer -> After batching an answer it is not included in the following batch', async () => {
        try {
            logger.info(`Starting batch test`);
            const created = await app.services.answer.create(...generateAnswerAndParams(1));

            const answerBatch1 = await app.services['answer-batch'].create({},{});
            const answerInBatch1 = getAnswerInBatches(created, answerBatch1);
            assert.isDefined(answerInBatch1);

            const answerBatch2 = await app.services['answer-batch'].create({},{});
            const answerInBatch2 = getAnswerInBatches(created, answerBatch2);
            assert.isUndefined(answerInBatch2);
        } catch (error) {
            assert.fail(error.message);
        }
    });

    it('Created answer -> Batching multiple answers it is not included in the following batch', async () => {
        try {
            const answers1 = [
                app.services.answer.create(...generateAnswerAndParams(2)),
                app.services.answer.create(...generateAnswerAndParams(3)),
                app.services.answer.create(...generateAnswerAndParams(4)),
            ];
            await Promise.all(answers1);

            const batch1 = await app.services['answer-batch'].create({},{});
            const answersBatch1 = batch1.find(ab => ab.pollingEventId == poll.pollingEventId)?.answers;
            assert.isDefined(answersBatch1?.find(a => a._to === 'person/2'));
            assert.isDefined(answersBatch1?.find(a => a._to === 'person/3'));
            assert.isDefined(answersBatch1?.find(a => a._to === 'person/4'));

            const answers2 = [
                app.services.answer.create(...generateAnswerAndParams(5)),
                app.services.answer.create(...generateAnswerAndParams(6)),
            ];
            await Promise.all(answers2);

            const batch2 = await app.services['answer-batch'].create({},{});
            const answersBatch2 = batch2.find(ab => ab.pollingEventId == poll.pollingEventId)?.answers;
            assert.isUndefined(answersBatch2?.find(a => a._to === 'person/2'));
            assert.isUndefined(answersBatch2?.find(a => a._to === 'person/3'));
            assert.isUndefined(answersBatch2?.find(a => a._to === 'person/4'));
            assert.isDefined(answersBatch2?.find(a => a._to === 'person/5'));
            assert.isDefined(answersBatch2?.find(a => a._to === 'person/6'));
        } catch (error) {
            assert.fail(error.message);
        }
    });
});
