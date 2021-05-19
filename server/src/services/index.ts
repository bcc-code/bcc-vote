import { Application } from '../declarations';
import person from './person/person.service';
import templates from './templates/templates.service';
import votings from './votings/votings.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(person);
  app.configure(templates);
  app.configure(votings);
}
