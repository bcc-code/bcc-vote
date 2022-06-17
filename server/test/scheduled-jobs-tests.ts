import 'mocha';
import { assert } from 'chai';
import app from '../src/app';
import { getAranoDBConfigFromFeathers, pollingEventsTestSet }  from './setup-tests/test-set';
import { PollingEvent, PollingEventStatus } from '../src/domain';
import { importDB} from "@bcc-code/arango-migrate";
import sinon from 'sinon';
import { sleep } from './setup-tests/test-utils';

describe('Scheduled jobs', async () => {
    let testSet:any;
    let pollingEvent: PollingEvent;

    beforeEach(async ()=>{
        await importDB(getAranoDBConfigFromFeathers(),true,false);
        testSet = pollingEventsTestSet();
        pollingEvent = await (testSet['eventForAllOrgs'])();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('Starting server with no active events does not schedule answer batching', async () => {
        try {            
            const activePollingEvents = await app.services['polling-event'].find({ query: { status: PollingEventStatus['Live']}});
            assert.equal(activePollingEvents.length, 0);
            
            const stubbedAnswerBatchingSvc = sinon.stub(app.services['answer-batch'], 'create');
            await sleep(2000);
            assert.equal(stubbedAnswerBatchingSvc.notCalled, true);
        } catch (error) {
            assert.fail(error.message);
        }
    });

    it('Starting server with active event schedules answer batching', async () => {
        try {
            await app.services['polling-event'].patch(pollingEvent._key, { status: PollingEventStatus['Live']},{});

            const stubbedAnswerBatchingSvc = sinon.stub(app.services['answer-batch'], 'create');
            assert.equal(stubbedAnswerBatchingSvc.notCalled, true);
            await sleep(1000);
            assert.equal(stubbedAnswerBatchingSvc.calledOnce, true);
            await sleep(1000);
            assert.equal(stubbedAnswerBatchingSvc.calledTwice, true);
        } catch (error) {
            assert.fail(error.message);
        }
    });
});
