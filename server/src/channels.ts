import '@feathersjs/transport-commons';
import { Application } from './declarations';
const Firestore = require('@google-cloud/firestore');


export default function(app: Application): void {
    if(typeof app.channel !== 'function') {
        return;
    }

    const db = new Firestore({
      projectId: 'bcc-vote',
    });

    app.services['polling-event'].publish('patched',async (data:any) => {

      if(!data.firestore){
        data.firestore = true
        var docRef =  await db.collection('polling-event').add(data)
        //console.log("Document written with ID: ", docRef.id);
      }else{
        return app.channel(data._key);
      }

        //return app.channel(data._key);
    });

    app.services.answer.publish('created',async (data:any) => {

      if(!data.firestore){
        data.firestore = true
        var docRef =  await db.collection('answer').add(data)
        //console.log("Document written with ID: ", docRef.id);
      }else{
        return app.channel(data.pollingEventId);
      }

    });

    app.services.poll.publish('patched', async (data:any) => {

      if(!data.firestore){
        data.firestore = true
        var docRef =  await db.collection('poll').add(data)
        //console.log("Document written with ID: ", docRef.id);
      }else{
        return app.channel(data.pollingEventId);
      }

    });

    // Listen for answers from firestore
    const answer = db.collection('answer').where('lastChanged','>',Date.now() - (1000 * 3))
    const answerObserver = answer.onSnapshot((docSnapshot:any) => {
      docSnapshot.docChanges().forEach((change:any) => {
        if (change.type === 'added') {
          app.service('answer').emit('created',change.doc.data())
          //console.log('new answer: ', change.doc.data());
        }
      });
    })

    // Listen for poll changes and re-emit the events
    const poll = db.collection('poll').where('lastChanged','>',Date.now() - (1000 * 3))
    const pollObserver = poll.onSnapshot((docSnapshot:any) => {
      docSnapshot.docChanges().forEach((change:any) => {
        if (change.type === 'added') {
          app.service('poll').emit('patched',change.doc.data())
          //console.log('patched poll: ', change.doc.data());
        }
      });
    })

    // Listen for poll changes and re-emit the events
    const pollingEvent = db.collection('polling-event').where('lastChanged','>',Date.now() - (1000 * 3))
    const pollingEventObserver = pollingEvent.onSnapshot((docSnapshot:any) => {
      docSnapshot.docChanges().forEach((change:any) => {
        if (change.type === 'added') {
          app.service('polling-event').emit('patched',change.doc.data())
          //console.log('patched polling-event: ', change.doc.data());
        }
      });
    })



}
