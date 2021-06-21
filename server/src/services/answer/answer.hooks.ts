import { HookContext } from "@feathersjs/feathers";
import { Answer, PollActiveStatus } from "../../domain";
import { db, FieldValue } from '../../firestore';

const preventMultipleVotes= async (context: HookContext) => {
    const vote = await context.app.service('answer').find({
        query: {
            _from: context.data._from,
            _to: context.data._to,
        }
    });
    if(vote.length > 0)
        throw Error('You cannot vote 2 times');
    return context;
};

const preventVoteOnInactivePoll = async (context:HookContext, poll:any) => {
    if(poll.activeStatus !== PollActiveStatus['Live'])
        throw Error('Poll is not active');

    return context;
};

const addVisibility = async (context:HookContext, poll:any) => {
    context.data.visibility = poll.resultVisibility;
    return context;
};

const checkPollData = async (context:HookContext) => {
    const key = context.data._from.split('/')[1];
    const poll = await context.app.service('poll').get(key);
    console.log(poll);

    context = await preventVoteOnInactivePoll(context,poll);
    context = await addVisibility(context,poll);
    
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
        create: [checkPollData, preventMultipleVotes, addUserData, addLastChangedTime, incrementCounter],
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
