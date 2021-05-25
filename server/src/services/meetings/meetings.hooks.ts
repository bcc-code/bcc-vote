import * as authentication from '@feathersjs/authentication';
import { HookContext } from "@feathersjs/feathers";
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const addNumberOfInvited = async (context: HookContext) => {

  
  const memberSvc = context.app.services.members;

  const data = context.data;
  const query: any = {
    $limit: 0,
  };
  query.churchID = data.churchID;
  query.role = data.role;
  query.minAge = data.minAge;
  query.maxAge= data.maxAge;

  const res = await memberSvc.find({query});
  context.data.numberOfInvited = res.total;

  return context;
}

const addAdministrator = async (context: HookContext) => {
  const userSvc = context.app.services.users;
  const meetingId = context.result._key;

  userSvc.get(context.params.user?._id)
  .then((res: any) => {
    res.administerMeetings.push(meetingId);
    userSvc.patch(res._key, {
      administerMeetings: res.administerMeetings
    })
  })
}

export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [ addNumberOfInvited ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [ addAdministrator ],
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
