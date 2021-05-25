import * as authentication from '@feathersjs/authentication';
import { HookContext } from "@feathersjs/feathers";
import { contentSecurityPolicy } from 'helmet';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const checkIfOnlyOne = async (context: HookContext) => {
  console.log('in the hook');
  const query = {
    $limit: 0,
    questionID: context.data.questionID,
    personID: context.data.personID,
  }
  console.log(query);
  const r = await context.app.services.answers.find({query});
  console.log(r);
  if(r.total > 0)
    throw Error('You cannot vote 2 times')
  
  return context;
}

const checkTime = async (context:HookContext) => {
  // const time = new Date().getTime();
  console.log(context);
  const question = await context.app.services.questions.get(context.data.questionID);
  if(question.isTime){
    const now = new Date().getTime();
    if(now > question.timeLimit)
      throw Error('too late');
  }

  return context;
}

export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [ checkTime , checkIfOnlyOne],
    update: [],
    patch: [ checkTime ],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
