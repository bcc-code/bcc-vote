import 'mocha'
import { assert } from 'chai';
import app from '../src/app';
import { getAranoDBConfigFromFeathers }  from './setup-tests/test-set'
import { importDB, Direction, MigrateWithConfig, deleteDatabase, pullDownTestDataLocally, ArangoDBConfig} from "@bcc-code/arango-migrate";


describe('polling-event', async () => {

    beforeEach(async ()=>{
        // This is the statement that makes DB to be re-imported before each test
        // It needs to be present in any `describe()` block where this functionality
        // is required.
        // Note that with this in place the tests *must* run in sequence!
        await importDB(getAranoDBConfigFromFeathers(),false,false);
    });

    it('Get a list of all poling events', async () => {

        try {
            const events = await app.services['polling-event'].find({}) as any[];
            assert.isTrue(events.length > 0);
        } catch (error) {
            assert.fail('It was not possible to retrieve a list of all polling events');
        }

    });




});
