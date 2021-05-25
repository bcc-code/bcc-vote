import { Application } from '../declarations';
import users from './users/users.service';
import members from './members/members.service';
import meetings from './meetings/meetings.service';
import questions from './questions/questions.service';
import answers from './answers/answers.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(users);
  app.configure(members);
  app.configure(meetings);
  app.configure(questions);
  app.configure(answers);
}
