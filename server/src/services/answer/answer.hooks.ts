import { HookContext } from "@feathersjs/feathers";
import { Answer, PollActiveStatus } from "../../domain";
import { db, FieldValue } from '../../firestore';

const preventMultipleVotes= async (context: HookContext) => {
    console.log('prevent double vote');
    const query = db.collection('answer').where('_to', '==', context.data._to).where('_from', '==', context.data._from);
    
    const res = await query.get();
    if(res._size > 0)
        throw Error('You cannot vote 2 times');
    return context;
};

const preventVoteOnInactivePoll = async (context:HookContext) => {
    const key = context.data._from.split('/')[1];
    const res = await db.collection('poll').doc(key).get();
    const poll = res.data();
    if(!res.exists)
        throw Error('Poll does not exist');

    if(poll.activeStatus !== PollActiveStatus['Live'])
        throw Error('Poll is not active');
    
    context.data.visibility = poll.resultVisibility;

    return context;
};

const addVisibility = async (context:HookContext) => {
    const key = context.data._from.split('/')[1];
    const poll = await db.collection('poll').doc(key).get().data();
    context.data.visibility = poll.resultVisibility;

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

const incrementCounter = async (context:HookContext) => {
    const { data } = context;
    const pollKey = data._from.split('/')[1];
    const pollRef = db.collection('poll-result').doc(pollKey);

    const countUpdate = {} as any;
    countUpdate['answerCount.'+context.data.answerId] = FieldValue.increment(1);

    await pollRef.update(countUpdate);

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
        create: [preventVoteOnInactivePoll, preventMultipleVotes, addVisibility, addUserData, addLastChangedTime, incrementCounter],
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
