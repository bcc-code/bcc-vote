import 'mocha';
import { assert } from 'chai';
import app from '../src/app';
import { getAranoDBConfigFromFeathers, pollingEventsTestSet } from './setup-tests/test-set';
import { Poll, PollActiveStatus } from '../src/domain';
import { importDB} from "@bcc-code/arango-migrate";
import sinon from 'sinon';
import { sleep } from './setup-tests/test-utils';
import logger from '../src/logger';

describe('Scheduled jobs', async () => {
    let testSet:any;
    let inactivePoll: Poll;
    const activePoll1 = {
        _id: 'poll/504310091',
        _key: '504310091',
    };
    const activePoll2 = {
        _id: 'poll/504310092',
        _key: '504310092',
    };

    beforeEach(async ()=>{
        await importDB(getAranoDBConfigFromFeathers(),true,false);
        testSet = pollingEventsTestSet();
        inactivePoll = await (testSet['forbiddenPoll'])();

    });

    afterEach(() => {
        sinon.restore();
    });

    it('Activating a poll schedules answer batching', async () => {
        try {
            let batchCount = 0;
            await app.services['answer-batch'].patch('default',{ deactivate: [activePoll1._id, activePoll2._id]},{});
            await app.services.poll.patch(inactivePoll._key, { activeStatus: PollActiveStatus['Live']},{});

            const stubbedSvc = sinon.stub(app.services['answer-batch'], 'create');
            stubbedSvc.callsFake(function () {
                batchCount++;
            });
            assert.equal(batchCount, 0);
            await sleep(2000);
            assert.isTrue(batchCount > 1);
            assert.isTrue(batchCount < 5);
        } catch (error) {
            assert.fail(error.message);
        }
    });

    it('Deactivating all polls disables answer batching', async () => {
        try {
            await app.services.poll.patch(inactivePoll._key, { activeStatus: PollActiveStatus['Finished']},{});
            await app.services.poll.patch(activePoll1._key, { activeStatus: PollActiveStatus['Finished']},{});
            await app.services.poll.patch(activePoll2._key, { activeStatus: PollActiveStatus['Finished']},{});

            const activePolls = await app.services.poll.find({ query: { activeStatus: PollActiveStatus['Live']}});
            assert.equal(activePolls.length, 0);
            logger.info(`All polls are inactive. Batching should be off`);

            const stubbedSvc = sinon.stub(app.services['answer-batch'], 'create');
            await sleep(1500);

            stubbedSvc.callsFake(function () {
                assert.fail('Answer batching was incorrectly triggered');
            });
            
        } catch (error) {
            assert.fail(error.message);
        }
    });
});
