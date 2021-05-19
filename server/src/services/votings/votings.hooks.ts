import { HookContext } from "@feathersjs/feathers";

const addVotersAndAdmins = async (context: HookContext) => {
  console.log(context.data.voters);
  const votingId = context.result._key;
  console.log(votingId);

  const voters = await context.app.services.person.find({
    query: {
      _key: {
        $in: context.data.voters
      }
    }
  })
  voters.data.forEach((voter: any) => {
    voter.votings.push(votingId);
    context.app.services.person.patch(voter._key, {
      votings: voter.votings
    });
  })
  const admins = await context.app.services.person.find({
    query: {
      _key: {
        $in: context.data.admins
      }
    }
  });
  admins.data.forEach((admin: any)=> {
    admin.votingsAdmin.push(votingId);
    context.app.services.person.patch(admin._key, {
      votingsAdmin: admin.votingsAdmin
    });
  })
  return context;
}

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [addVotersAndAdmins],
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
