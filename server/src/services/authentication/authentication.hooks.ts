import { HookContext } from "@feathersjs/feathers";

const purgeUser = (context: HookContext) => {
    if(context.result.user && context.result.user.secretInUse) {
        delete context.result.user.secretInUse
    }
    return context;
};

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [purgeUser],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
