import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
const socketio = require('@feathersjs/socketio-client');
const io = require('socket.io-client');

import feathers from '@feathersjs/feathers';


export default function (app: Application): void {

  const Firestore = require('@google-cloud/firestore');

  try {
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

    })



    // var docRef =  await db.collection("123245").add({
    //     first: "Ada",
    //     last: "Lovelace",
    //     born: 1815
    // })
    //console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);

  }
}
