import * as authentication from '@feathersjs/authentication';
import { HookContext } from "@feathersjs/feathers";
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const notSupported = async (context: HookContext) => {
  throw Error(`The action ${context.path} is not supported.`);
}

export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [notSupported],
    update: [notSupported],
    patch: [notSupported],
    remove: [notSupported]
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
