import '@feathersjs/transport-commons';
import { Application } from './declarations';
import { PollingEvent, Answer, Poll, PollResultVisibility, PollResultDetails} from './domain';
import { db } from './firebase';

export default function(app: Application): void {
    const startupDate = Date.now();
    if(typeof app.channel !== 'function') {
        return;
    }
    
    app.services['polling-event'].publish('patched',async (data:PollingEvent) => {
        if(!data.firestore) return;
        return app.channel(data._key);
    });

    app.services.answer.publish('created',async (data:Answer) => {

        if(!data.firestore) return;
        if(data.visibility !== PollResultVisibility['Anonymous'])
            return app.channel(data.pollingEventId);
    });

    app.services['poll-result'].publish('patched', async (data: PollResultDetails) => {
        if(!data.firestore) return;
        return app.channel(data.pollingEventId);
    });

    app.services.poll.publish('patched', async (data:Poll) => {
        if(!data.firestore) return;
        return app.channel(data.pollingEventId);
    });

    const answer = db.collection('answer').where('lastChanged', '>=', startupDate);
    answer.onSnapshot((docSnapshot:any) => {
        docSnapshot.docChanges().forEach((change:any) => {
            if (change.type === 'added') {
                const data = change.doc.data();
                data.firestore = true;
                app.service('answer').emit('created', data);
            }
        });
    });

    const poll = db.collection('poll').where('lastChanged', '>=', startupDate);
    poll.onSnapshot((docSnapshot:any) => {
        docSnapshot.docChanges().forEach((change:any) => {
            if (change.type === 'added' || change.type === 'modified') {
                const data = change.doc.data();
                data.firestore = true;
                app.service('poll').emit('patched', data);
            }
        });
    });

    const pollResult = db.collection('poll-result').where('lastChanged', '>=', startupDate);
    pollResult.onSnapshot((docSnapshot:any) => {
        docSnapshot.docChanges().forEach((change:any) => {
            if (change.type === 'modified') {
                const data = change.doc.data();
                data.firestore = true;
                app.service('poll-result').emit('patched', data);
            }
        });
    });

    const pollingEvent = db.collection('polling-event').where('lastChanged', '>=', startupDate);
    pollingEvent.onSnapshot((docSnapshot:any) => {
        docSnapshot.docChanges().forEach((change:any) => {
            if (change.type === 'added' || change.type === 'modified') {
                const data = change.doc.data();
                data.firestore = true;
                app.service('polling-event').emit('patched', data);
            }
        });
    });
}
