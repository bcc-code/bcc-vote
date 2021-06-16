import { HookContext } from "@feathersjs/feathers";
import { Answer, PollActiveStatus } from "../../domain";
import { db, FieldValue, FieldPath } from '../../firestore';

const preventMultipleVotes= async (context: HookContext) => {
    const query = db.collection('answer').where('_to', '==', context.data._to).where('_from', '==', context.data._from);
    
    const res = await query.get();
    if(res._size > 0)
        throw Error('You cannot vote 2 times');
    return context;
};

const preventVoteOnInactivePoll = async (context:HookContext) => {
    // const query = db.collection('poll').where('_id', '==', context.data._from);
    const key = context.data._from.split('/')[1];
    const res = await db.collection('poll').doc(key).get();
    if(!res.exists)
        throw Error('Poll does not exist');

    if(res.data().activeStatus !== PollActiveStatus['Live'])
        throw Error('Poll is not active');

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

const removeFromFirestore = async (context: HookContext) => {
    console.log(context.params.query);
    const toRemove = db.collection('answer').where('_from', '==', context.params.query?._from);

    const allAnswers = await toRemove.get();

    let batch = db.batch();
    let batchCount = 0;
    allAnswers.forEach(async (ans:any) => {
        batch.delete(ans.ref);
        batchCount ++;

        // we cannot have more than 500 deletes in one batch
        if(batchCount >= 500){
            await batch.commit();
            batch = db.batch();
            batchCount = 0;
        }
    });
    await batch.commit();

    return context;
};

export default {
    before: {
        all: [ ],
        find: [],
        get: [],
        create: [preventMultipleVotes, preventVoteOnInactivePoll, addUserData, addLastChangedTime, incrementCounter],
        update: [],
        patch: [],
        remove: [removeFromFirestore]
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
