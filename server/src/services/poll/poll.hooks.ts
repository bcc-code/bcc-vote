import { HookContext } from "@feathersjs/feathers";
// Don't remove this comment. It's needed to format import lines nicely.

const validateAndFormat = (context: HookContext) => {
  const { data } = context;
  if (!data.title || data.title === '') throw Error('Validation Error: Please provide a title')
  return context;
};

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [validateAndFormat],
    update: [validateAndFormat],
    patch: [validateAndFormat],
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
