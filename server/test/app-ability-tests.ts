import 'mocha';
import { assert } from 'chai';
import { importDB } from '@bcc-code/arango-migrate';
import { getAranoDBConfigFromFeathers, pollingEventsTestSet }  from './setup-tests/test-set';
import { subject } from '@casl/ability';
import { defineAbilityFor,subjects,actions  } from '../src/permissions/appAbility';
import { RoleName } from '../src/domain';

describe('permissions - app ability', async () => {
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

    const runPermissionsTest = async function (action:actionsType, onEntity:any, expected: boolean, entityName:any="", activeRole?:RoleName, changedData:any="") {

        try {
            const user = await testSet.user();
            const ability = defineAbilityFor(user,activeRole);
            const entity = await (testSet[entityName])() as any;

            console.log('Role',activeRole)
            console.log('Entity',entity)
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
    activeRole?:RoleName
 }

  const useCases:Array<useCaseType> = [
      // Permissions for get and find should be identical for polling events
      { action:"find", subject:"polling-event", activeRole:"Member", entity:'scopedToLocalChurchSameAsLoggedInUser', expected: true },
      { action:"find", subject:"polling-event", activeRole:"Member", entity:'scopedToLocalChurchDifferentAsLoggedInUser', expected: false },
      { action:"find", subject:"polling-event", activeRole:"Member", entity:'scopedAgeOutsideOfLoggedInUserAge', expected: false },
      { action:"find", subject:"polling-event", activeRole:"Member", entity:'scopedLoggedInUserIsCreatorOfEvent', expected: true },

      { action:"get", subject:"polling-event", activeRole:"Member", entity:'scopedToLocalChurchSameAsLoggedInUser', expected: true },
      { action:"get", subject:"polling-event", activeRole:"Member", entity:'scopedToLocalChurchDifferentAsLoggedInUser', expected: false },
      { action:"get", subject:"polling-event", activeRole:"Member", entity:'scopedAgeOutsideOfLoggedInUserAge', expected: false },
      { action:"get", subject:"polling-event", activeRole:"Member", entity:'scopedLoggedInUserIsCreatorOfEvent', expected: true },
      { action:"create", subject:"polling-event", activeRole:"Member", entity:'scopedToLocalChurchSameAsLoggedInUser', expected: false },

      { action:"find", subject:"role", entity:'user', activeRole:"Member", expected: false },
      { action:"find", subject:"org", entity:'user', activeRole:"Member", expected: false },

      { action:"update", subject:"poll", entity:'basePoll', activeRole:"Member", expected: false },
      { action:"patch", subject:"poll", entity:'basePoll', activeRole:"Member", expected: false },
      { action:"remove", subject:"poll", entity:'basePoll', activeRole:"Member", expected: false },

      { action:"update", subject:"polling-event", activeRole:"Developer", entity:'scopedLoggedInUserIsCreatorOfEvent', expected: true },
      { action:"patch", subject:"polling-event", activeRole:"Developer", entity:'scopedToLocalChurchSameAsLoggedInUser', expected: true },

      { action:"find", subject:"role", entity:'user', activeRole:"Developer", expected: true },
      { action:"find", subject:"org", entity:'user', activeRole:"Developer", expected: true },

      { action:"update", subject:"poll", entity:'basePoll', activeRole:"Developer", expected: true },
      { action:"patch", subject:"poll", entity:'basePoll', activeRole:"Developer", expected: true },
      { action:"remove", subject:"poll", entity:'basePoll', activeRole:"Developer", expected: true },

      { action:"create", subject:"polling-event", activeRole:"VotingAdmin", entity:'scopedToLocalChurchSameAsLoggedInUser', expected: true },
      { action:"create", subject:"polling-event", activeRole:"VotingAdmin", entity:'scopedToLocalChurchDifferentAsLoggedInUser', expected: false },

  ];

  useCases.forEach((useCase) => {

      it.only(`Logged In User -> Attemps to ${useCase.action} ${useCase.subject} (${useCase.entity}), expected: ${useCase.expected}`, async () => { await runPermissionsTest(
          useCase.action,
          useCase.subject,
          useCase.expected,
          useCase.entity,
          useCase.activeRole
      );
      });


  });
});
