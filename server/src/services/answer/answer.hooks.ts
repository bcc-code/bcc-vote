import { HookContext } from "@feathersjs/feathers";
import logger from '../../logger';
import { Answer, PollActiveStatus, User } from "../../domain";
import { db, FieldValue } from '../../firestore';
import { defineAbilityFor } from "../../permissions/appAbility";
import { ForbiddenError, subject } from "@casl/ability";

const preventVoteOnInactivePoll = async (context:HookContext):Promise<HookContext> => {
    const key = context.data._from.split('/')[1];
    const res = await context.app.service('poll').get(key);

    if(res.activeStatus !== PollActiveStatus['Live'])
        throw Error('Poll is not active');

    return context;
};

const preventVoteOnForbiddenPoll = async (context:HookContext):Promise<HookContext> => {
    if(!context.data.pollingEventId) {
        throw Error('Polling event id is undefined');
    }
    const pollingEvent = await context.app.service('polling-event').get(context.data.pollingEventId);

    if(pollingEvent){
        const ability = defineAbilityFor(context.params.user as User);
        ForbiddenError.from(ability).throwUnlessCan('find',subject('polling-event',pollingEvent));
        return context;
    } else {
        throw Error('Could not get pollingEvent to check user permissions');
    }
};

const addUserData = (context:HookContext):HookContext => {
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

const addCustomKey = async (context:HookContext):Promise<HookContext> => {
    const pollKey = context.data._from.split('/')[1];
    context.data._key = pollKey+'-'+context.params?.user?._key;

    return context;
};

const incrementCounter = async (context:HookContext):Promise<HookContext> => {
    const { result } = context;
    const pollKey = result._from.split('/')[1];
    const pollRef = db.collection('poll-result').doc(pollKey);

    const countUpdate = {} as any;
    countUpdate['answerCount.'+result.answerId] = FieldValue.increment(1);

    await pollRef.update(countUpdate);

    return context;
};

const addLastChangedTime = (context: HookContext):HookContext => {
    const { data } = context;
    data.lastChanged = Date.now();
    return context;
};

const handleMultipleVotesError = (context: HookContext):HookContext => {
    if(context.error.errorNum === 1210) {
        logger.info('User tried to vote twice');
        throw new Error('You cannot vote 2 times');
    }
    return context;
};


export default {
    before: {
        all: [ ],
        find: [],
        get: [],
        create: [preventVoteOnForbiddenPoll, preventVoteOnInactivePoll, addUserData, addCustomKey, addLastChangedTime],
        update: [],
        patch: [],
        remove: []
    },
    after: {
        all: [],
        find: [],
        get: [],
        create: [incrementCounter],
        update: [],
        patch: [],
        remove: []
    },
    error: {
        all: [],
        find: [],
        get: [],
        create: [handleMultipleVotesError],
        update: [],
        patch: [],
        remove: []
    }
};
