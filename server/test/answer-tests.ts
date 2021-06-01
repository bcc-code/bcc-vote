import 'mocha'
import { assert } from 'chai';
import app from '../src/app';
import { getAranoDBConfigFromFeathers }  from './setup-tests/test-set'
import { importDB, Direction, MigrateWithConfig, deleteDatabase, pullDownTestDataLocally, ArangoDBConfig} from "@bcc-code/arango-migrate";


describe('Anwswer', async () => {

  beforeEach(async ()=>{
    // This is the statement that makes DB to be re-imported before each test
    // It needs to be present in any `describe()` block where this functionality
    // is required.
    // Note that with this in place the tests *must* run in sequence!
    await importDB(getAranoDBConfigFromFeathers(),true,false);
  });

  it('Get a user', async () => {

    try {
      const userSvc = app.services.user;
      var user = await userSvc.get("178509735",{}) as any

        assert.equal(user._key,"178509735")
    } catch (error) {
        assert.fail('Could find a user through the user service')
    }
  });


});
