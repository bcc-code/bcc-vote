import 'mocha';
import { assert } from 'chai';
import app from '../src/app';
import { generateFreshContext }  from './setup-tests/test-set';
import io from 'socket.io-client';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';

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
            assert.equal(res.activeStatus,'not_started');
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
            app.service('polling-event').on('patched', (event:any)=>{ 
                res = event;
            });
            await app.service('polling-event').patch('504279890', {
                activeStatus: 'not_started',
            }, null);

            // Assert
            assert.equal(res._key,'504279890');
            assert.equal(res.activeStatus,'not_started');
        } catch (error) {
            assert.fail('There should be no error. Error:',error);
        }
    });
    it.only('Get data via socket -> answer created', async () => {
        try {
            // Prepare
            const context  = await generateFreshContext();
            context.params.provider = '';

            const client = feathers();
            const socket = io('http://localhost:4040');
            client.configure(socketio(socket));

            // Act
            await client.service('polling-event').get('504279890',context.params);

            // console.log(app.channel('504279890'));

            // let res:any;
            // app.service('answer').on('created', (ans:any)=>{ 
            //     res = ans;
            // });
            // await app.service('answer').create({
            //     _from: 'poll/504310092',
            //     _to: 'user/178509735',
            //     answerId: '1232',
            //     pollingEventId: '1232',
            // }, context.params);

            // // Assert
            // assert.equal(res.answerId, '1232');
        } catch (error) {
            assert.fail('There should be no error. Error:',error);
        }
    });



});
