import 'mocha';
import { assert } from 'chai';
import app from '../src/app';
import { generateFreshContext }  from './setup-tests/test-set'




describe('channels', () => {


  before(function() {
    // server = app.listen(port);
    // server.once('listening', () => done());
  });

  after(function() {
    //server.close(done);
  });

  it('Add user to a polling-event channel', async () => {
    try {
      // Prepare
      var context  = await generateFreshContext()
      context.params.provider = ''

      // Act
      let result = await app.service('polling-event').get('504279890',context.params)
      let channels = app.channels

      // Assert
      assert.equal(channels[0],'504279890')
    } catch (error) {
      assert.fail('There should be no error. Error:',error)
    }

  });



});
