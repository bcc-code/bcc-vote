import 'mocha';
import { assert } from 'chai';
import app from '../src/app';
import { generateFreshContext }  from './setup-tests/test-set';
import {PollActiveStatus} from '../src/domain';

describe('channels', () => {
    let context:any;

    beforeEach(async() => {
        context  = await generateFreshContext();
        context.params.provider = '';

        // person id added to a channel by getting polling event
        await app.service('polling-event').get('504279890', context.params);
    });

    afterEach(function() {
        app.channel('504279890').connections = [];
        //server.close(done);
    });

    it('Check if user got added to the channel', async () => {
        try {
            assert.equal(context.params.connection, app.channel('504279890').connections[0]);
        } catch (error) {
            assert.fail('There should be no error. Error:',error);
        }

    });
    it('Get data via socket -> poll patched', async () => {
        try {
            let res:any;
            context.app.service('poll').on('patched', (poll:any)=>{ 
                if(poll.pollingEventId === app.channels[0])
                    res = poll;
            });
            await app.service('poll').patch('504310091', {
                activeStatus: 'not_started',
            }, context.params);

            // Assert
            assert.equal(res._key,'504310091');
            assert.equal(res.activeStatus,'not_started');
        } catch (error) {
            assert.fail('There should be no error. Error:',error);
        }
    });
    it('Get data via socket -> polling event patched', async () => {
        try {
            // Act
            let res:any;
            context.app.service('polling-event').on('patched', (pollingEvent:any)=>{ 
                if(pollingEvent._key === app.channels[0])
                    res = pollingEvent;
            });
            await app.service('polling-event').patch('504279890', {
                status: 'live',
            }, context.params);
            
            // Assert
            assert.equal(res._key, '504279890');
            assert.equal(res.status, 'live');
        } catch (error) {
            assert.fail('There should be no error. Error:',error);
        }
    });
    it('Get data via socket -> answer created', async () => {
        let res:any;
        context.app.service('answer').on('created', (ans:any)=>{
            if(ans.pollingEventId === app.channels[0])
                res = ans;
        });
        await app.service('poll').patch('504310092', {activeStatus: PollActiveStatus['Live']}, {});
        await sleep(300);
        const ans:any = await app.service('answer').create({
            _from: 'poll/504310092',
            _to: 'user/54512',
            answerId: '1',
            pollingEventId: '504279890',
        }, context.params);
        await sleep(300);
        // // Assert
        assert.equal(res._key, ans._key);
        assert.equal(res.answerId, '1');
    });

    it('different polling event gets patched', async () => {
        try {
            // Act
            let res:any;
            context.app.service('polling-event').on('patched', (pollingEvent:any)=>{ 
                if(pollingEvent._key === app.channels[0])
                    res = pollingEvent;
            });
            await app.service('polling-event').patch('504306892', {
                status: 'finished',
            }, context.params);
            
            // Assert
            assert.equal(res, undefined);
        } catch (error) {
            assert.fail('There should be no error. Error:',error);
        }
    });

    it('poll from different polling event gets patched', async () => {
        try {
            let res:any;
            context.app.service('poll').on('patched', (poll:any)=>{ 
                if(poll.pollingEventId === app.channels[0])
                    res = poll;
            });
            await app.service('poll').patch('504310091', {
                activeStatus: 'not_started',
            }, context.params);
            // Assert
            assert.equal(res._key,'504310091');
            assert.equal(res.activeStatus,'not_started');
        } catch (error) {
            assert.fail('There should be no error. Error:',error);
        }
    });

    function sleep(ms:number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
});
