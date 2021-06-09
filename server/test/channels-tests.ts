import 'mocha';
import { assert } from 'chai';
import app from '../src/app';
import { generateFreshContext }  from './setup-tests/test-set';




describe('channels', () => {


    before(function() {
        // server = app.listen(port);
        // server.once('listening', () => done());
    });

    after(function() {
        //server.close(done);
    });

    it('Add user to a polling-event channel via getting this event', async () => {
        try {
            // Prepare
            const context  = await generateFreshContext();
            context.params.provider = '';

            // Act
            await app.service('polling-event').get('504279890',context.params);
            const channels = app.channels;

            // Assert
            assert.equal(channels[0],'504279890');
        } catch (error) {
            assert.fail('There should be no error. Error:',error);
        }

    });

    it('Add user to a polling-event channel via getting a poll from this event', async () => {
        try {
            // Prepare
            const context  = await generateFreshContext();
            context.params.provider = '';

            // Act
            await app.service('poll').get('504310091',context.params);
            const channels = app.channels;

            // Assert
            assert.equal(channels[0],'504279890');
        } catch (error) {
            assert.fail('There should be no error. Error:',error);
        }

    });

    it('Get data via socket -> poll patched', async () => {
        try {
            // Prepare
            const context  = await generateFreshContext();
            context.params.provider = '';

            // Act
            await app.service('polling-event').get('504279890',context.params);

            let res:any;
            app.service('poll').on('patched', (poll:any)=>{ 
                res = poll;
            });
            await app.service('poll').patch('504310091', {
                activeStatus: 'not_started',
            }, null);

            // Assert
            assert.equal(res._key,'504310091');
        } catch (error) {
            assert.fail('There should be no error. Error:',error);
        }
    });
    it('Get data via socket -> polling event patched', async () => {
        try {
            // Prepare
            const context  = await generateFreshContext();
            context.params.provider = '';

            // Act
            await app.service('polling-event').get('504279890',context.params);

            let res:any;
            app.service('polling-event').on('patched', (poll:any)=>{ 
                res = poll;
            });
            await app.service('polling-event').patch('504279890', {
                activeStatus: 'not_started',
            }, null);

            // Assert
            assert.equal(res._key,'504310091');
        } catch (error) {
            assert.fail('There should be no error. Error:',error);
        }
    });



});
