import * as authentication from '@feathersjs/authentication';
import { HookContext } from "@feathersjs/feathers";
const { authenticate } = authentication.hooks;
// Don't remove this comment. It's needed to format import lines nicely.



const validateAndFormat = (context: HookContext) => {
  const { data } = context;

  if (data.participantFilter.maxAge == undefined ) data.participantFilter.maxAge = 150
  if (data.participantFilter.minAge == undefined ) data.participantFilter.minAge = 0
  if (!data.title || data.title === '') throw Error('Validation Error: Please provide a title')
  if (!data.startDateTime || isNaN(Date.parse(data.startDateTime))) throw Error('Validation Error: Date is invalid')
  if (data.creatorId) data.creatorId = Number(data.creatorId)

  return context;
};

const addChannel = async (context: HookContext) => {
  if(context.id && context.params.connection)
    context.app.channel(context.id.toString()).join(context.params.connection);
};

export default {
  before: {
    all: [ ],
    find: [],
    get: [ addChannel ],
    create: [ validateAndFormat ],
    update: [validateAndFormat ],
    patch: [ ],
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
