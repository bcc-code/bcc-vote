import { Application } from '../declarations';
import user from './users/users.service';
import pollEvent from './polling-event/polling-event.service';
import poll from './poll/poll.service';
import answer from './answer/answer.service';
import membersExternal from './members-external/members-external-services';

export default function (app: Application): void {
  app.configure(user);
  app.configure(pollEvent);
  app.configure(poll);
  app.configure(answer);
  app.configure(membersExternal);
}
