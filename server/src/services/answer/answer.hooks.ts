import { HookContext } from "@feathersjs/feathers";
import { Answer } from "../../domain/Answer";

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

const addUserData = async (context:HookContext) => {
    const { user } = context.params;
    if(!user) {
        throw Error('User is undefined');
    }
    console.log(user)
    const withUserFields = {
        ...context.data,
        displayName: user.displayName,
        churchName: user.church.org.name,
    } as Answer;
    context.data = withUserFields;
    return context;
};

export default {
  before: {
    all: [ ],
    find: [],
    get: [],
    create: [checkPollActive, checkIfOnlyOne, addUserData],
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
