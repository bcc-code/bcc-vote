import 'mocha';
import { assert } from 'chai';
import { Server } from 'http';
import app from '../src/app';
const Firestore = require('@google-cloud/firestore');
const port = app.get('port') || 8998;

describe('Firebase', () => {
  let server: Server;

  before(function(done) {
    server = app.listen(port);
    server.once('listening', () => done());
  });

  after(function(done) {
    server.close(done);
  });

  it.skip('setup a firebase instance', async (done) => {

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

      const observer = doc.onSnapshot((docSnapshot:any) => {
        //console.log(`Received doc snapshot: ${docSnapshot}`);
        //console.log(docSnapshot.docChanges());

        docSnapshot.docChanges().forEach((change:any) => {
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

      }, (err:any) => {
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

  async function sleep(msec:any) {
    return new Promise(resolve => setTimeout(resolve, msec));
  }


});
