import * as authentication from '@feathersjs/authentication';
// Don't remove this comment. It's needed to format import lines nicely.
import { Hook, HookContext } from '@feathersjs/feathers';

const { authenticate } = authentication.hooks;

const addUser = async (context: HookContext) => {
  const { data } = context;

  const user = context.params.user;

  // console.log(user);

  const text = data.text;

  context.data = {
    text,
    name: user!.email,
    createdAt: new Date().getTime()
  }

  return context;
}

export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [addUser],
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
