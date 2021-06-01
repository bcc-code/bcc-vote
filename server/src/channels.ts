import '@feathersjs/transport-commons';
import { Application } from './declarations';

export default function(app: Application): void {
  if(typeof app.channel !== 'function') {
    return;
  }

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
}
