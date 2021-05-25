import '@feathersjs/transport-commons';
import { HookContext } from '@feathersjs/feathers';
import { Application } from './declarations';

export default function(app: Application): void {
  if(typeof app.channel !== 'function') {
    // If no real-time functionality has been configured just return
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
  // Here you can also add service specific event publishers
  // e.g. the publish the `users` service `created` event to the `admins` channel
  // app.service('users').publish('created', () => app.channel('admins'));
  
  // With the userid and email organization from above you can easily select involved users
  // app.service('messages').publish(() => {
  //   return [
  //     app.channel(`userIds/${data.createdBy}`),
  //     app.channel(`emails/${data.recipientEmail}`)
  //   ];
  // });
}
