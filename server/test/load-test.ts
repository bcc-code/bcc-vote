import 'mocha';
import { assert } from 'chai';
import { Server } from 'http';
const socketio = require('@feathersjs/socketio-client');
const io = require('socket.io-client');
import feathers from '@feathersjs/feathers';
import { getFeahtersToken }  from './setup-tests/test-set'
import app from '../src/app';
import { sleep } from './setup-tests/test-utils';




// -----------------------------------------------------------------------------------------
// NB!!! Before running this performance test you have to run
// npm run mocha-dev-in-cloud
// this will set the NODE_ENV to dev-in-cloud which will use the dev-in-cloud config file
// in the config file you will notice the performacnce test are reliying on hard coded data
// to be present
// -----------------------------------------------------------------------------------------

describe('load test', () => {
    const testingVariables = app.get('testingSet')
    const host = app.get('host')
    const protocol = app.get('protocol')

  it.skip('Perform a socket load test on an environment', async (done) => {

    try {
      let numberOfConnections = 1500
      let counter = 1
      let clientsPromises = []
      while (counter != numberOfConnections) {
        clientsPromises.push(newFeathersClient())
        console.log('new conainer added no:',counter)
        counter++
      }

      var clients = await Promise.all(clientsPromises)
     //var answer = await clients[0].service('answer').get('1340021880',{})
      var a = {
        "_id": testingVariables.answerId,
        "_from": testingVariables.pollId,
        "_to": testingVariables.userId,
        "answerId": 1623243249532,
        "pollingEventId": "1339667582",
        "displayName": "Philip Dalen",
        "churchName": "Oslo/Follo",
        "lastChanged": 1623335253622
      }


      var answer = await clients[0]?.service('answer').create(a,{})
      var deletedAnswer = await clients[0]?.service('answer').remove(answer._key,{})

      let events = await  clients[0]?.service('polling-event').find({}) as any[];

      while (true) {
        await sleep(100)
      }

    } catch (error) {
      assert.fail(error.message)
    }
  });


async function newFeathersClient() {
  try {

    let url = `${protocol}://${host}`
      let token = await getFeahtersToken()
      const socket = io(url, {
        transports:["websocket", "polling"],
        extraHeaders: {
          'Authorization': `bearer ${token}`
        }
    });

      const membersClient = feathers()

      membersClient.configure(socketio(socket, {
        timeout: 400000
      }));


      var event = await membersClient.service('polling-event').get(testingVariables.pollingEentId,{})
      console.log('Socket was added to the polling-event channel')

      membersClient.service('answer').on('batched',(a:any)=>{
        console.log('[RECEIVED PUBLISHED ANSWER IN CLIENT]')
      })

      return membersClient

  } catch (error) {
    console.log(error)
  }

}

});
