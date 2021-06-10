import 'mocha';
import { assert, use } from 'chai';
import { Server } from 'http';
import url from 'url';
import feathers from '@feathersjs/feathers';
import { getFeahtersToken }  from './setup-tests/test-set'
import app from '../src/app';

const firebase = require("firebase");
const Firestore = require('@google-cloud/firestore');
// Required for side-effects
require("firebase/firestore");
var admin = require("firebase-admin");

const port = app.get('port') || 8998;
const getUrl = (pathname?: string): string => url.format({
  hostname: app.get('host') || 'localhost',
  protocol: 'http',
  port,
  pathname
});

describe('Firebase', () => {
  let server: Server;

  before(function(done) {
    server = app.listen(port);
    server.once('listening', () => done());
  });

  after(function(done) {
    server.close(done);
  });

  it.only('setup a firebase instance', async (done) => {

    try {

      // var serviceAccount = require("../config/bcc-vote-firebase-adminsdk-yclzv-748f6c9c87.json");
      // admin.initializeApp({
      //   credential: admin.credential.cert(serviceAccount)
      // });

      const db = new Firestore({
        projectId: 'bcc-vote',
        //keyFilename: './config/bcc-vote-firebase-adminsdk-yclzv-748f6c9c87.json',
      });

      const doc = db.collection('123245')

      const observer = doc.onSnapshot(docSnapshot => {
        //console.log(`Received doc snapshot: ${docSnapshot}`);
        //console.log(docSnapshot.docChanges());

        docSnapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            console.log('New city: ', change.doc.data());
          }
          if (change.type === 'modified') {
            console.log('Modified city: ', change.doc.data());
          }
          if (change.type === 'removed') {
            console.log('Removed city: ', change.doc.data());
          }
        });

      }, err => {
        console.log(`Encountered error: ${err}`);
      });



      var docRef =  await db.collection("123245").add({
          first: "Ada",
          last: "Lovelace",
          born: 1815
      })
      console.log("Document written with ID: ", docRef.id);

      while (true) {
        await sleep(200)
      }

    } catch (error) {
      console.error("Error adding document: ", error);
      assert.fail(error.message)
    }



  });

  async function sleep(msec) {
    return new Promise(resolve => setTimeout(resolve, msec));
  }


});
