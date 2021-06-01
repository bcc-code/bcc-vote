import * as authentication from '@feathersjs/authentication';
import { HookContext } from "@feathersjs/feathers";

const { authenticate } = authentication.hooks;

const checkIfOnlyOne = async (context: HookContext) => {
  const query = {
    $limit: 0,
    _from: context.data._from,
    _to: context.data._to,
  };
  const r = await context.app.service('answer').find({query});
  if(r.total > 0)
    throw Error('You cannot vote 2 times');
  
  return context;
};

const checkPollActive = async (context:HookContext) => {
//   const poll = await context.app.service('poll').get(context.data._from);
//   if(poll.activeStatus !== 0){
//     throw Error('Poll is not active');
//   }
  return context;
};

export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [checkPollActive, checkIfOnlyOne],
    update: [],
    patch: [],
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
