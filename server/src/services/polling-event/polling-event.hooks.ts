import * as authentication from '@feathersjs/authentication';
import { HookContext } from "@feathersjs/feathers";
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const addNumberOfInvited = async (context: HookContext) => {
  const memberSvc = context.app.services.members;

  const data = context.data;
  const query: any = {
    $limit: 0,
  };
  query.churchID = data.churchID;
  query.role = data.role;
  query.minAge = data.minAge;
  query.maxAge= data.maxAge;

  const res = await memberSvc.find({query});
  context.data.numberOfInvited = res.total;

  return context;
};

const addChannel = async (context: HookContext) => {
  if(context.id && context.params.connection)
    context.app.channel(context.id.toString()).join(context.params.connection);
};

export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [ addChannel ],
    create: [ addNumberOfInvited ],
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
