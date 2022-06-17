import 'mocha';
import { assert } from 'chai';
import app from '../src/app';
import { getAranoDBConfigFromFeathers, pollingEventsTestSet }  from './setup-tests/test-set';
import { Answer, PollingEventAnswerBatch, User } from '../src/domain';
import { importDB} from "@bcc-code/arango-migrate";

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
            const created = await app.services.answer.create(answer,{ user});

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
});
