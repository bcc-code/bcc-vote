import '@feathersjs/transport-commons';
import { Application } from './declarations';
import { PollActiveStatus, PollingEvent, Answer, Poll, Option } from './domain';
import { db } from './firestore';

export default function(app: Application): void {
    if(typeof app.channel !== 'function') {
        return;
    }
    
    app.services['polling-event'].publish('patched',async (data:PollingEvent) => {
        if(!data.firestore){
            data.firestore = true;
            db.collection('polling-event').doc(data._key).set(data);
            //console.log("Document written with ID: ", docRef.id);
        }else{
            return app.channel(data._key);
        }
        //return app.channel(data._key);
    });

    app.services.answer.publish('created',async (data:Answer) => {

        if(!data.firestore){
            data.firestore = true;
            await db.collection('answer').doc(data._key).set(data);
            //console.log("Document written with ID: ", docRef.id);
        }else{
            return app.channel(data.pollingEventId);
        }
    });

    app.services['poll-result'].publish('patched', (data: any) => {
        return app.channel(data.pollingEventId);
    });

    app.services.poll.publish('patched', async (data:Poll) => {

        if(!data.firestore){
            data.firestore = true;
            if(data.activeStatus === PollActiveStatus['Live']){
                const pollRes = {
                    pollingEventId: data.pollingEventId,
                    answerCount: {} as {[answerId: number]: number}
                };
                data.answers.forEach((opt:Option) => {
                    pollRes.answerCount[opt.answerId] = 0;
                });

                await db.collection('poll-result').doc(data._key).set(pollRes);
            }
            await db.collection('poll').doc(data._key).set(data);
            //console.log("Document written with ID: ", docRef.id);
        }else{
            return app.channel(data.pollingEventId);
        }
    });

    // Listen for answers from firestore
    const answer = db.collection('answer');
    const answerObserver = answer.onSnapshot((docSnapshot:any) => {
        docSnapshot.docChanges().forEach((change:any) => {
            if (change.type === 'added') {
                app.service('answer').emit('created',change.doc.data());
                //console.log('new answer: ', change.doc.data());
            }
        });
    });

    // Listen for poll changes and re-emit the events
    const poll = db.collection('poll');
    const pollObserver = poll.onSnapshot((docSnapshot:any) => {
        docSnapshot.docChanges().forEach((change:any) => {
            if (change.type === 'added' || change.type === 'modified') {
                app.service('poll').emit('patched',change.doc.data());
                //console.log('patched poll: ', change.doc.data());
            }
        });
    });

    const pollResult = db.collection('poll-result');
    const pollResultObserver = pollResult.onSnapshot((docSnapshot:any) => {
        docSnapshot.docChanges().forEach((change:any) => {
            if (change.type === 'modified') {
                app.service('poll-result').emit('patched',change.doc.data());
            }
        });
    });

    // Listen for poll changes and re-emit the events
    const pollingEvent = db.collection('polling-event');
    const pollingEventObserver = pollingEvent.onSnapshot((docSnapshot:any) => {
        docSnapshot.docChanges().forEach((change:any) => {
            
            if (change.type === 'added' || change.type === 'modified') {
                app.service('polling-event').emit('patched',change.doc.data());
                //console.log('patched polling-event: ', change.doc.data());
            }
        });
    });
}
