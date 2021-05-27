import { HookContext } from "@feathersjs/feathers";
// Don't remove this comment. It's needed to format import lines nicely.

const logErrors = async (context: HookContext) => {
  console.error(context.error.name ,'from app.hooks.ts:', context.error.message,'during', context.method, context.path, 'context.params', context.params, 'context.error:', context.error)
}

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
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
    all: [logErrors],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
