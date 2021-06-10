import 'mocha';
import { assert, use } from 'chai';
import { Server } from 'http';
import url from 'url';
import axios from 'axios';
const socketio = require('@feathersjs/socketio-client');
const io = require('socket.io-client');
import feathers from '@feathersjs/feathers';
import { getFeahtersToken }  from './setup-tests/test-set'
import app from '../src/app';

const port = app.get('port') || 8998;
const getUrl = (pathname?: string): string => url.format({
  hostname: app.get('host') || 'localhost',
  protocol: 'http',
  port,
  pathname
});

describe('Feathers application server tests', () => {
  let server: Server;

  before(function(done) {
    server = app.listen(port);
    server.once('listening', () => done());
  });

  after(function(done) {
    server.close(done);
  });

  it('starts and shows the index page', async (done) => {

    try {
      let numberOfConnections = 500
      let counter = 1
     let clients = []
     while (counter != numberOfConnections) {
       clients.push(await newFeathersClient())

       counter++
     }

      let events = await  clients[0].service('polling-event').find({}) as any[];
      assert.isTrue(events.length > 0)
     done()
    } catch (error) {
      assert.fail(error.message)
    }
    const membersConfig = app.get("members");


  });

async function newFeathersClient() {

  let url = `http://${app.get('host')}:${app.get('port')}`
      let token = await getFeahtersToken()
      const socket = io(url, {
        extraHeaders: {
          'Authorization': `bearer ${token}`
        }
      });

      const membersClient = feathers()

      membersClient.configure(socketio(socket, {
        timeout: 400000
      }));

      return membersClient
}

});
