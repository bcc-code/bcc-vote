import '@feathersjs/transport-commons';
import { HookContext } from '@feathersjs/feathers';
import { Application } from './declarations';

export default function(app: Application): void {
  if(typeof app.channel !== 'function') {
    return;
  }

  app.services.meetings.publish('patched', data => {

    return app.channel(data._key);
  })
  app.services.answers.publish('created', data => {
    console.log(data.meetingID);
    return app.channel(data.meetingID);
  })
  app.services.answers.publish('patched', data => {
    console.log(data.meetingID);
    return app.channel(data.meetingID);
  })

  app.services.questions.publish('created', data => {
    console.log(data.meetingID);
    return app.channel(data.meetingID);
  })

  app.services.questions.publish('patched', data => {
    console.log(data.meetingID);
    return app.channel(data.meetingID);
  })
}
