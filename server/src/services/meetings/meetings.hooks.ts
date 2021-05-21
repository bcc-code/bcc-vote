import * as authentication from '@feathersjs/authentication';
import { HookContext } from "@feathersjs/feathers";
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const setUserInformation = async (context: HookContext) => {
  // console.log(context);
  const query = {
    churchID: ''
  };
  // set up all the queries
  if(context.data.local){
    query.churchID = context.params.user?.churchID;
  }
  console.log(query);

  const res = await context.app.services.users.find({query})
  const invited = res.data;
  console.log(invited);
}

export default {
  before: {
    all: [ authenticate('jwt') ],
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
    create: [ setUserInformation ],
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
