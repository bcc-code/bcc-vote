import 'mocha';
import { assert } from 'chai';
import { importDB } from '@bcc-code/arango-migrate';
import { getAranoDBConfigFromFeathers, pollingEventsTestSet }  from './setup-tests/test-set';
import { subject } from '@casl/ability';
import { defineAbilityFor,subjects,actions  } from '../src/permissions/appAbility';
import { RoleName } from '../src/domain';

describe.only('permissions - app ability', async () => {
    type actionsType = (typeof actions)[number]
    type subjectType = (typeof subjects)[number]

    let testSet:any;

    before(async ()=>{
        // This is the statement that makes DB to be re-imported before each test
        // It needs to be present in any `describe()` block where this functionality
        // is required.
        // Note that whith this in place the tests *must* run in sequence!
        await importDB(getAranoDBConfigFromFeathers(),false,false);
        testSet = pollingEventsTestSet();
    });

    const runPermissionsTest = async function (action:actionsType, onEntity:any, expected: boolean, entityName:any="", hasRoles:Array<RoleName>, changedData:any="") {

        try {
            const user = await testSet.user(hasRoles);
            const ability = defineAbilityFor(user);
            const entity = await (testSet[entityName])() as any;
            let result = false;
            switch (action) {
            case "create":
                result = ability.can(action,subject(onEntity, entity));
                break;
            case "get":
                result = ability.can(action,subject(onEntity, entity));
                break;
            case "patch":
                result = ability.can(action,subject(onEntity,entity));
                break;
            case "update":
                result = ability.can(action,subject(onEntity,entity));
                break;
            case "find":
                const rule = ability.relevantRuleFor(action,subject(onEntity,entity));
                result = ability.can(action,subject(onEntity,entity));
                break;
            case "remove":
                result = ability.can(action,subject(onEntity,entity));
                break;
            default:
                throw Error("unknown action");
            }
            // Assert
            assert.equal(result, expected);
        } catch (error) {
            console.error(error);
            assert.fail(error.messaage);
        }
    };


  interface useCaseType {
    action:actionsType,
    subject: subjectType,
    expected:boolean,
    field?:any,
    entity?:string,
    hasRoles:Array<RoleName>
 }

  const useCases:Array<useCaseType> = [
      // Permissions for get and find should be identical for polling events
    //   { action:"find", subject:"polling-event", hasRoles:["Member"], entity:'scopedToLocalChurchSameAsLoggedInUser', expected: true },
    //   { action:"find", subject:"polling-event", hasRoles:["Member"], entity:'scopedToLocalChurchDifferentAsLoggedInUser', expected: false },
    //   { action:"find", subject:"polling-event", hasRoles:["Member"], entity:'scopedAgeOutsideOfLoggedInUserAge', expected: false },
    //   { action:"find", subject:"polling-event", hasRoles:["Member"], entity:'scopedLoggedInUserIsCreatorOfEvent', expected: true },
    //   { action:"find", subject:"polling-event", hasRoles:["OrgRepresentative","Member"], entity:'scopedToRepresentativesEvent', expected: true },
    //   { action:"find", subject:"polling-event", hasRoles:["Member","VotingAdmin","Developer"], entity:'scopedToRepresentativesEvent', expected: false },
    //   { action:"find", subject:"polling-event", hasRoles:["Member","VotingAdmin","Developer"], entity:'eventForDifferentOrgButMatchingRole', expected: false },
    //   { action:"find", subject:"polling-event", hasRoles:["Member","VotingAdmin","Developer"], entity:'eventForDifferentRoleButMatchingOrg', expected: false },

    //   { action:"get", subject:"polling-event", hasRoles:["Member"], entity:'scopedToLocalChurchSameAsLoggedInUser', expected: true },
    //   { action:"get", subject:"polling-event", hasRoles:["Member"], entity:'scopedToLocalChurchDifferentAsLoggedInUser', expected: false },
    //   { action:"get", subject:"polling-event", hasRoles:["Member"], entity:'scopedAgeOutsideOfLoggedInUserAge', expected: false },
    //   { action:"get", subject:"polling-event", hasRoles:["Member"], entity:'scopedLoggedInUserIsCreatorOfEvent', expected: true },
    //   { action:"get", subject:"polling-event", hasRoles:["OrgRepresentative","Member"], entity:'scopedToRepresentativesEvent', expected: true },
    //   { action:"get", subject:"polling-event", hasRoles:["Member","VotingAdmin","Developer"], entity:'scopedToRepresentativesEvent', expected: false },
    //   { action:"get", subject:"polling-event", hasRoles:["Member","VotingAdmin","Developer"], entity:'eventForDifferentOrgButMatchingRole', expected: false },
    //   { action:"get", subject:"polling-event", hasRoles:["Member","VotingAdmin","Developer"], entity:'eventForDifferentRoleButMatchingOrg', expected: false },
      { action:"get", subject:"polling-event", hasRoles:["OrgRepresentative"], entity:'eventForNationalRepresentatives', expected: true },
      { action:"get", subject:"polling-event", hasRoles:["Member"], entity:'eventForNationalRepresentatives', expected: false },

    //   { action:"create", subject:"polling-event", hasRoles:["Member"], entity:'scopedToLocalChurchSameAsLoggedInUser', expected: false },

    //   { action:"find", subject:"role", entity:'user', hasRoles:["Member"], expected: false },
    //   { action:"find", subject:"org", entity:'user', hasRoles:["Member"], expected: false },

    //   { action:"update", subject:"poll", entity:'basePoll', hasRoles:["Member"], expected: false },
    //   { action:"patch", subject:"poll", entity:'basePoll', hasRoles:["Member"], expected: false },
    //   { action:"remove", subject:"poll", entity:'basePoll', hasRoles:["Member"], expected: false },

    //   { action:"update", subject:"polling-event", hasRoles:["Developer"], entity:'scopedLoggedInUserIsCreatorOfEvent', expected: true },
    //   { action:"patch", subject:"polling-event", hasRoles:["Developer"], entity:'scopedToLocalChurchSameAsLoggedInUser', expected: true },

    //   { action:"find", subject:"role", entity:'user', hasRoles:["Developer"], expected: true },
    //   { action:"find", subject:"org", entity:'user', hasRoles:["Developer"], expected: true },

    //   { action:"update", subject:"poll", entity:'basePoll', hasRoles:["Developer"], expected: true },
    //   { action:"patch", subject:"poll", entity:'basePoll', hasRoles:["Developer"], expected: true },
    //   { action:"remove", subject:"poll", entity:'basePoll', hasRoles:["Developer"], expected: true },

    //   { action:"create", subject:"polling-event", hasRoles:["VotingAdmin"], entity:'scopedToLocalChurchSameAsLoggedInUser', expected: true },
    //   { action:"create", subject:"polling-event", hasRoles:["VotingAdmin"], entity:'scopedToLocalChurchDifferentAsLoggedInUser', expected: false },
    //   { action:"patch", subject:"polling-event", hasRoles:["VotingAdmin"], entity:'eventForAllOrgs', expected: false },
    //   { action:"remove", subject:"polling-event", hasRoles:["VotingAdmin"], entity:'scopedToLocalChurchDifferentAsLoggedInUser', expected: false },
    //   { action:"find", subject:"org", hasRoles:["VotingAdmin"], entity:'organisationUserIsAdminFor', expected: true },
    //   { action:"find", subject:"org", hasRoles:["VotingAdmin"], entity:'organisationUserIsNotAdminFor', expected: false },

    //   { action:"update", subject:"poll", entity:'basePoll', hasRoles:["Developer"], expected: true },
    //   { action:"patch", subject:"poll", entity:'basePoll', hasRoles:["Developer"], expected: true },
    //   { action:"remove", subject:"poll", entity:'basePoll', hasRoles:["Developer"], expected: true },

    //   { action:"find", subject:"answer", entity:"publicAnswer", hasRoles:["Developer"], expected: true},
    //   { action:"find", subject:"answer", entity:"nonpublicAnswer", hasRoles:["Developer"], expected: true},
    //   { action:"find", subject:"answer", entity:"anonymousAnswer", hasRoles:["Developer"], expected: false},

    //   { action:"find", subject:"answer", entity:"publicAnswer", hasRoles:["VotingAdmin"], expected: true},
    //   { action:"find", subject:"answer", entity:"nonpublicAnswer", hasRoles:["VotingAdmin"], expected: true},
    //   { action:"find", subject:"answer", entity:"anonymousAnswer", hasRoles:["VotingAdmin"], expected: false},

    //   { action:"find", subject:"answer", entity:"publicAnswer", hasRoles:["Member"], expected: true},
    //   { action:"find", subject:"answer", entity:"nonpublicAnswer", hasRoles:["Member"], expected: false},
    //   { action:"find", subject:"answer", entity:"anonymousAnswer", hasRoles:["Member"], expected: false},

    //   { action:"create", subject:"feedback", entity:"feedbackData", hasRoles:["Member"], expected: true},

    //   { action:"get", subject: "answer", entity: "ownAnswer", hasRoles: ["Member"], expected: true},
    //   { action:"get", subject: "answer", entity: "someoneElsesAnswer", hasRoles: ["Member"], expected: false},
  ];

  useCases.forEach((useCase) => {

      it(`Logged In User -> ${useCase.hasRoles[0]} attemps to ${useCase.action} ${useCase.subject} (${useCase.entity}), expected: ${useCase.expected}`, async () => { await runPermissionsTest(
          useCase.action,
          useCase.subject,
          useCase.expected,
          useCase.entity,
          useCase.hasRoles
      );
      });

  });
});
