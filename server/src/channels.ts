import '@feathersjs/transport-commons';
import { Application } from './declarations';
import { PollingEvent, Answer, Poll, PollResultVisibility} from './domain';
import { db } from './firestore';

export default function(app: Application): void {
    const startupDate = Date.now();
    if(typeof app.channel !== 'function') {
        return;
    }
    
    app.services['polling-event'].publish('patched',async (data:PollingEvent) => {
        if(!data.firestore){
            data.firestore = true;
            db.collection('polling-event').doc(data._key).set(data);
        }else{
            return app.channel(data._key);
        }
    });

    app.services.answer.publish('created',async (data:Answer) => {

        if(!data.firestore){
            data.firestore = true;
            await db.collection('answer').doc(data._key).set(data);
        }else{
            if(data.visibility !== PollResultVisibility['Anonymous'])
                return app.channel(data.pollingEventId);
        }
    });

    app.services['poll-result'].publish('patched', (data: any) => {
        return app.channel(data.pollingEventId);
    });

    app.services.poll.publish('patched', async (data:Poll) => {

        if(!data.firestore){
            data.firestore = true;
            
            await db.collection('poll').doc(data._key).set(data);
        }else{
            return app.channel(data.pollingEventId);
        }
    });

    // Listen for answers from firestore
    const answer = db.collection('answer').where('lastChanged', '>=', startupDate);
    answer.onSnapshot((docSnapshot:any) => {
        docSnapshot.docChanges().forEach((change:any) => {
            if (change.type === 'added') {
                app.service('answer').emit('created',change.doc.data());
            }
        });
    });

    // Listen for poll changes and re-emit the events
    const poll = db.collection('poll').where('lastChanged', '>=', startupDate);
    poll.onSnapshot((docSnapshot:any) => {
        docSnapshot.docChanges().forEach((change:any) => {
            if (change.type === 'added' || change.type === 'modified') {
                app.service('poll').emit('patched',change.doc.data());
            }
        });
    });

    const pollResult = db.collection('poll-result');
    let initPollResult = true;
    pollResult.onSnapshot((docSnapshot:any) => {
        if(initPollResult){
            initPollResult = false;
            return;
        }
        docSnapshot.docChanges().forEach((change:any) => {
            if (change.type === 'modified') {
                app.service('poll-result').emit('patched',change.doc.data());
            }
        });
    });

    const pollingEvent = db.collection('polling-event').where('lastChanged', '>=', startupDate);
    pollingEvent.onSnapshot((docSnapshot:any) => {
        docSnapshot.docChanges().forEach((change:any) => {
            if (change.type === 'added' || change.type === 'modified') {
                app.service('polling-event').emit('patched',change.doc.data());
            }
        });
    });
}
