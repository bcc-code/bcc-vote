import '@feathersjs/transport-commons';
import { Application } from './declarations';
import { PollingEvent, Poll, PollResultDetails, PollingEventAnswerBatch, PollActiveStatus} from './domain';
import { db } from './firestore';

export default function(app: Application): void {
    const startupDate = Date.now();
    if(typeof app.channel !== 'function') {
        return;
    }
    
    app.services['polling-event'].publish('patched',async (data:PollingEvent) => {
        if(!data.firestore) return;
        return app.channel(data._key);
    });

    app.services.answer.publish('batched',async (data: PollingEventAnswerBatch) => {
        return app.channel(data.pollingEventId);
    });

    app.services.poll.on('patched', async (data:Poll) => {
        if(data.activeStatus === PollActiveStatus['Live']) {
            await app.services['answer-batch'].patch('default', {activate: [data._id]}, {});
        }
        if(data.activeStatus === PollActiveStatus['Finished']) {
            await app.services['answer-batch'].patch('default', {deactivate: [data._id]}, {});
        } 
    });

    app.services['poll-result'].publish('patched', async (data: PollResultDetails) => {
        if(!data.firestore) return;
        return app.channel(data.pollingEventId);
    });

    app.services.poll.publish('patched', async (data:Poll) => {
        if(!data.firestore) return;
        return app.channel(data.pollingEventId);
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
