import 'mocha'
import { assert } from 'chai';
import app from '../src/app';
import { getAranoDBConfigFromFeathers, pollingEventsTestSet }  from './setup-tests/test-set';
import { Answer } from '../src/domain/Answer';
import { importDB} from "@bcc-code/arango-migrate";

describe('Form Validation', async () => {
    let testSet:any;

  beforeEach(async ()=>{
    // This is the statement that makes DB to be re-imported before each test
    // It needs to be present in any `describe()` block where this functionality
    // is required.
    // Note that with this in place the tests *must* run in sequence!
    await importDB(getAranoDBConfigFromFeathers(),true,false);
    testSet = pollingEventsTestSet();
  });
  it('answer -> Adds user fields', async () => {
    try {
        const user = await (testSet['user'])() as any;
        user.church = {
            org: {
                name: 'Terwolde'
            }
        }
        const poll = await (testSet['basePoll'])() as any;
        const answer = {
            _from: poll._id,
            _to: user._id,
            answerId: 122131232,
            pollingEventId: poll.pollingEventId
        }
        const result = await app.service('answer').create(answer,{ user}) as Answer;
        assert.equal(result.displayName,user.displayName);
        assert.equal(result.churchName,'Terwolde');
    } catch (error) {
        assert.fail(error.message);
    }
  });


});
