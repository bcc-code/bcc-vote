import 'mocha'
import { assert } from 'chai';
import app from '../src/app';
import { getAranoDBConfigFromFeathers, pollingEventsTestSet }  from './setup-tests/test-set';
import { Answer, PollActiveStatus } from '../src/domain';
import { importDB} from "@bcc-code/arango-migrate";

describe('Form Validation', async () => {
    let testSet:any;
    let poll:any;
    let user:any;

    beforeEach(async ()=>{
        // This is the statement that makes DB to be re-imported before each test
        // It needs to be present in any `describe()` block where this functionality
        // is required.
        // Note that with this in place the tests *must* run in sequence!
        await importDB(getAranoDBConfigFromFeathers(),true,false);
        testSet = pollingEventsTestSet();

        poll = await (testSet['basePoll'])() as any;
        user = await (testSet['user'])() as any;
        user.churchName = 'Terwolde';
    });

    it('Get a user', async () => {
        try {
            const userSvc = app.services.user;
            const getUser = await userSvc.get("178509735",{}) as any;
            assert.equal(getUser._key,"178509735");
        } catch (error) {
            assert.fail('Could find a user through the user service');
        }
    });

    it('answer -> Adds user fields', async () => {
        try {
            //Activate poll
            await app.service('poll').patch(poll._key,{ activeStatus: PollActiveStatus['Live']},{});
            const answer = {
                _from: poll._id,
                _to: user._id,
                answerId: 122131232,
                pollingEventId: poll.pollingEventId
            };
            await sleep(300);
            const result = await app.service('answer').create(answer,{ user}) as Answer;
            assert.equal(result.displayName,user.displayName);
        } catch (error) {
            assert.fail(error.message);
        }
    });

    it('answer -> Unable to answer twice', async () => {
        try {
            //Activate poll
            await app.service('poll').patch(poll._key,{ activeStatus: PollActiveStatus['Live']},{});
            const answer1 = {
                _from: poll._id,
                _to: user._id,
                answerId: 122131232,
                pollingEventId: poll.pollingEventId
            };
            await sleep(300);
            const answer2 = {...answer1, answerId: 222131232};
            await app.service('answer').create(answer1,{ user}) as Answer;
            await sleep(300);
            await app.service('answer').create(answer2,{ user}) as Answer;
            assert.fail('Was able to answer the same poll twice.');
        } catch (error) {
            assert.isTrue(error.message.includes('You cannot vote 2 times'));
        }
    });

    it('answer -> Unable to give answer to an inactive poll', async () => {
        try {
            //Deactivate poll
            await app.service('poll').patch(poll._key,{ activeStatus: PollActiveStatus['Not Started']},{});
            const answer = {
                _from: poll._id,
                _to: user._id,
                answerId: 122131232,
                pollingEventId: poll.pollingEventId
            };
            await sleep(300);
            await app.service('answer').create(answer,{ user}) as Answer;
            assert.fail('Was able to answer an inactive poll.');
        } catch (error) {
            assert.isTrue(error.message.includes('Poll is not active'));
        }
    });
    it('result -> get results for a poll', async () => {
        try{
            await app.service('poll').patch(poll._key,{ activeStatus: PollActiveStatus['Live']},{});
            await sleep(300);

            let results = await app.service('poll-result').get(poll._key) as any;
            console.log(results);
            assert.equal(results.answerCount['1'], 0);
            assert.equal(results.answerCount['2'], 0);
            
            const answer = {
                _from: poll._id,
                _to: user._id,
                answerId: '1',
                pollingEventId: poll.pollingEventId
            };
            await app.service('answer').create(answer, {user});

            await sleep(300);

            results = await app.service('poll-result').get(poll._key) as any;
            assert.equal(results.answerCount['1'], 1);
            assert.equal(results.answerCount['2'], 0);
        }catch (error) {
            assert.fail(error.message);
        }
    });
    it('result -> reset results for a poll', async () => {
        try{
            await app.service('poll').patch(poll._key,{ activeStatus: PollActiveStatus['Live']},{});
            await sleep(300);

            let results = await app.service('poll-result').get(poll._key) as any;
            assert.equal(results.answerCount['1'], 0);
            assert.equal(results.answerCount['2'], 0);
            
            const answer = {
                _from: poll._id,
                _to: user._id,
                answerId: '1',
                pollingEventId: poll.pollingEventId
            };
            await app.service('answer').create(answer, {user});

            await sleep(300);

            results = await app.service('poll-result').get(poll._key) as any;
            assert.equal(results.answerCount['1'], 1);
            assert.equal(results.answerCount['2'], 0);

            await app.service('poll').patch(poll._key,{ activeStatus: PollActiveStatus['Live']},{});
            await sleep(300);
            results = await app.service('poll-result').get(poll._key) as any;
            assert.equal(results.answerCount['1'], 0);
            assert.equal(results.answerCount['2'], 0);
        }catch (error) {
            assert.fail(error.message);
        }
    });
    function sleep(ms:number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
});
