import * as authentication from '@feathersjs/authentication';
import { HookContext } from "@feathersjs/feathers";
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const addChannel = async (context: HookContext) => {
  if(context.id && context.params.connection)
    context.app.channel(context.id.toString()).join(context.params.connection);
};

export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [ addChannel ],
    create: [ ],
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