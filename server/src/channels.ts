import '@feathersjs/transport-commons';
import { Application } from './declarations';

export default function(app: Application): void {
    if(typeof app.channel !== 'function') {
        return;
    }

    app.on('login', (payload:any, { connection }:any) => {
        const lastChannel = connection.user.lastChannel;
        if(lastChannel){
            app.channel(lastChannel).join(connection);
            console.log('joined', lastChannel);
        }
    });

    app.services['polling-event'].publish('patched', (data:any) => {

        return app.channel(data._key);
    });
    app.services.answer.publish('created', (data:any) => {
        return app.channel(data.pollingEventId);
    });

    app.services.answer.publish('patched', (data:any) => {
        return app.channel(data.pollingEventId);
    });

    app.services.poll.publish('created', (data:any) => {
        return app.channel(data.pollingEventId);
    });

    app.services.poll.publish('patched', (data:any) => {
        return app.channel(data.pollingEventId);
    });


    app.services.poll.publish('updated', (data:any) => {
        return app.channel(data.pollingEventId);
    });

    app.services.poll.publish('removed', (data:any) => {
        return app.channel(data.pollingEventId);
    });
}
