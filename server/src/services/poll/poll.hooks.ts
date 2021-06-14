import * as authentication from '@feathersjs/authentication';
import { HookContext } from "@feathersjs/feathers";
// Don't remove this comment. It's needed to format import lines nicely.

const validateAndFormat = async (context: HookContext):Promise<HookContext> => {
    const { data } = context;
    if (!data.title || data.title === '') throw Error('Validation Error: Please provide a title');
    return context;
};

const addChannel = async (context: HookContext):Promise<HookContext> => {
    if(context.result.pollingEventId && context.params.connection)
        context.app.channel(context.result.pollingEventId.toString()).join(context.params.connection);
    return context;
};

const addTime = async (context: HookContext):Promise<HookContext> => {
    context.data.createdAt = new Date().getTime();

    return context;
};

const addLastChangedTime = (context: HookContext) => {
  const { data } = context;
  data.lastChanged = Date.now()
  return context;
};

export default {
    before: {
        all: [],
        find: [],
        get: [],
        create: [validateAndFormat, addTime,addLastChangedTime],
        update: [validateAndFormat, addLastChangedTime],
        patch: [addLastChangedTime],
        remove: []
    },

    after: {
        all: [],
        find: [],
        get: [ addChannel ],
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
