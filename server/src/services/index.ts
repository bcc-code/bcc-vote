import { Application } from '../declarations';
import users from './users/users.service';
import meetings from './meetings/meetings.service';
import questions from './questions/questions.service';
import answers from './answers/answers.service';
import membersExternal from './members-external/members-external-services'
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(users);
  app.configure(meetings);
  app.configure(questions);
  app.configure(answers);
  app.configure(membersExternal)
}
