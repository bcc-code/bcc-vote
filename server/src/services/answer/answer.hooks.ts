import { HookContext } from "@feathersjs/feathers";
import { Answer, PollActiveStatus } from "../../domain";

const preventMultipleVotes= async (context: HookContext) => {
    const query = {
        _from: context.data._from,
        _to: context.data._to,
    };
    const r = await context.app.service('answer').find({query});
    if(r.length > 0)
        throw Error('You cannot vote 2 times');

    return context;
};

const preventVoteOnInactivePoll = async (context:HookContext) => {
    const pollKey = context.data._from.split('/')[1];
    const poll = await context.app.service('poll').get(pollKey);
    if(poll.activeStatus !== PollActiveStatus['Live']){
        throw Error('Poll is not active');
    }
    return context;
};

const addUserData = async (context:HookContext) => {
    const { user } = context.params;
    if(!user) {
        throw Error('User is undefined');
    }
    const withUserFields = {
        ...context.data,
        displayName: user.displayName,
    } as Answer;

    context.data = withUserFields;
    return context;
};

const addLastChangedTime = (context: HookContext) => {
    const { data } = context;
    data.lastChanged = Date.now();
    return context;
};

export default {
    before: {
        all: [ ],
        find: [],
        get: [],
        create: [ preventMultipleVotes, preventVoteOnInactivePoll, addUserData, addLastChangedTime],
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
