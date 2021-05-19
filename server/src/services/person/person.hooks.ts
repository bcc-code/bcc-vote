import { HookContext } from "@feathersjs/feathers";

const addVotingsArray = (context: HookContext) => {
  context.data.votings = [];
  context.data.votingsAdmin = [];
  return context;
}

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [addVotingsArray],
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
