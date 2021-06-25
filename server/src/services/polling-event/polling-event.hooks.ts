import '@feathersjs/transport-commons';
import { HookContext } from "@feathersjs/feathers";

const validateAndFormat = (context: HookContext) => {
    const { data } = context;

    if (data.participantFilter.maxAge == undefined ) data.participantFilter.maxAge = 150;
    if (data.participantFilter.minAge == undefined ) data.participantFilter.minAge = 0;
    if (!data.title || data.title === '') throw Error('Validation Error: Please provide a title');
    if (!data.startDateTime || isNaN(Date.parse(data.startDateTime))) throw Error('Validation Error: Date is invalid');
    if (data.creatorId) data.creatorId = Number(data.creatorId);

    return context;
};

const addLastChangedTime = (context: HookContext) => {
    const { data } = context;
    data.lastChanged = Date.now();
    return context;
};

const addChannel = (context: HookContext):HookContext => {
    if(context.id && context.params.connection){
        const channelName = context.id.toString();
        const connection = context.params.connection;
        context.app.channel(channelName).join(connection);
    }
    return context;
};


export default {
    before: {
        all: [ ],
        find: [],
        get: [ addChannel ],
        create: [ validateAndFormat, addLastChangedTime ],
        update: [ validateAndFormat, addLastChangedTime ],
        patch: [ addLastChangedTime ],
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
