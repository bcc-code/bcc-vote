import 'mocha'
import { assert } from 'chai';
import app from '../src/app';
import { getAranoDBConfigFromFeathers, newEntitiesFunc }  from './setup-tests/test-set'
import { importDB, Direction, MigrateWithConfig, deleteDatabase, pullDownTestDataLocally, ArangoDBConfig} from "@bcc-code/arango-migrate";


describe('Form Validation', async () => {

  let newEntities: any;

  beforeEach(async ()=>{
    // This is the statement that makes DB to be re-imported before each test
    // It needs to be present in any `describe()` block where this functionality
    // is required.
    // Note that with this in place the tests *must* run in sequence!
    await importDB(getAranoDBConfigFromFeathers(),true,false);
    newEntities = newEntitiesFunc()
  });

  it('polling-event -> Create without ages', async () => {
    try {
      let entity = newEntities.newValidPollingEvent
      delete entity.participantFilter.minAge
      delete entity.participantFilter.maxAge
      const res = await app.service('polling-event').create(entity,{}) as any
      assert.equal(res.participantFilter.maxAge,150)
      assert.equal(res.participantFilter.minAge,0)
    } catch (error) {
        assert.fail('Ages should automatically be set if not present')
    }
  });

  it('polling-event -> Create without title', async () => {
    try {
      let entity = newEntities.newValidPollingEvent
      entity.title = ''
      const res = await app.service('polling-event').create(entity,{}) as any
      assert.fail('It should not be allowed to create a polling-event without a title')
    } catch (error) {
      assert.equal(error.message,'Validation Error: Please provide a title')
    }
  });

  it('polling-event -> Invalid date', async () => {
    try {
      let entity = newEntities.newValidPollingEvent
      entity.startDateTime = 'foo'
      const res = await app.service('polling-event').create(entity,{}) as any
      assert.fail('It should not be allowed to create a polling-event without a invalid date')
    } catch (error) {
      assert.equal(error.message,'Validation Error: Date is invalid')
    }
  });

  it('polling-event -> creatorId is not a number ', async () => {
    try {
      let entity = newEntities.newValidPollingEvent
      entity.creatorId = '12345'
      const res = await app.service('polling-event').create(entity,{}) as any
      assert.isTrue(entity.creatorId === 12345)
    } catch (error) {
      assert.equal(error.message,'Validation Error: creatorId has to be a number')
    }
  });

  it('poll -> Create without title', async () => {
    try {
      let entity = newEntities.newValidPoll
      entity.title = ''
      const res = await app.service('poll').create(entity,{}) as any
      assert.fail('It should not be allowed to create a polling-event without a title')
    } catch (error) {
      assert.equal(error.message,'Validation Error: Please provide a title')
    }
  });


});
