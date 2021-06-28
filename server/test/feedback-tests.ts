import 'mocha'
import { assert } from 'chai';
import app from '../src/app';
import { pollingEventsTestSet }  from './setup-tests/test-set';

describe('polling-event', async () => {
    let testSet:any;

    before(async ()=>{
        testSet = pollingEventsTestSet();
    });
    it.only('Create feedback', async () => {
        try{
            const data = testSet.feedbackData();
            await app.service('feedback').create(data);

        } catch (error) {
            assert.fail('There should be no error');
        }
    });

});