import '@feathersjs/transport-commons';
import { HookContext } from "@feathersjs/feathers";
import { PollActiveStatus, Option } from '../../domain';
import { db } from '../../firestore';
// Don't remove this comment. It's needed to format import lines nicely.

const validateAndFormat = async (context: HookContext):Promise<HookContext> => {
    const { data } = context;
    if (!data.title || data.title === '') throw Error('Validation Error: Please provide a title');
    return context;
};

const addChannel = (context: HookContext):HookContext => {
    if(context.result.pollingEventId && context.params.connection)
        context.app.channel(context.result.pollingEventId.toString()).join(context.params.connection);
    return context;
};

const addTime = async (context: HookContext):Promise<HookContext> => {
    context.data.createdAt = new Date().getTime();

    return context;
};

const addLastChangedTime = (context: HookContext):HookContext => {
    const { data } = context;
    data.lastChanged = Date.now();
    return context;
};

const removeFromFirestore = async (id:string) => {
    const toRemove = db.collection('answer').where('_from', '==', id);

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
};

const removeFromArango = (context: HookContext) => {
    return context.app.services.answer.remove(null, {
        query: {
            _from: context.result._id
        }
    });
};

const resetPollResults = async(context: HookContext):Promise<HookContext> => {
    const pollRes = {
        pollingEventId: context.result.pollingEventId,
        pollId: context.result._key,
        answerCount: {} as {[answerId: number]: number}
    };
    context.result.answers.forEach((opt:Option) => {
        pollRes.answerCount[opt.answerId] = 0;
    });
    await db.collection('poll-result').doc(context.result._key).set(pollRes);
    
    return context;
};

const removeAllAnswers = async (context: HookContext):Promise<HookContext> => {
    if(context.result.activeStatus !== PollActiveStatus['Live'])
        return context;
    const promises = [];
    promises.push(removeFromFirestore(context.result._id));
    promises.push(removeFromArango(context));
    promises.push(resetPollResults(context));

    await Promise.all(promises);

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
        create: [ resetPollResults ],
        update: [],
        patch: [ removeAllAnswers ],
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
