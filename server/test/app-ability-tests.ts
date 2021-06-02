import 'mocha';
import { assert } from 'chai';
import { importDB } from '@bcc-code/arango-migrate';
import { getAranoDBConfigFromFeathers, pollingEventsTestSet }  from './setup-tests/test-set';
import { subject } from '@casl/ability';
import { defineAbilityFor,subjects,actions  } from '../src/permissions/appAbility';

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

  const runPermissionsTest = async function (action:actionsType, onEntity:any, expected: boolean, entityName:any="", changedData:any="") {

    try {
      const user = await testSet.user();
      const ability = defineAbilityFor(user);
      const entity = await (testSet[entityName])() as any;

      let result = false;
      switch (action) {
      case "create":
        result = ability.can(action,entity);
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
    entity?:string
 }

  const useCases:Array<useCaseType> = [
    { action:"find", subject:"polling-event", entity:'scopedToLocalChurchSameAsLoggedInUser', expected: true },
    { action:"find", subject:"polling-event", entity:'scopedToLocalChurchDifferentAsLoggedInUser', expected: false },
    { action:"find", subject:"polling-event", entity:'scopedAgeOutsideOfLoggedInUserAge', expected: false },
    { action:"find", subject:"polling-event", entity:'scopedLoggedInUserIsCreatorOfEvent', expected: true },
    { action:"find", subject:"role", entity:'user', expected: true },
    { action:"find", subject:"org", entity:'user', expected: true },
    { action:"patch", subject:"polling-event", entity:'scopedToLocalChurchSameAsLoggedInUser', expected: true },
    { action:"update", subject:"poll", entity:'basePoll', expected: true },
    { action:"patch", subject:"poll", entity:'basePoll', expected: true },
    { action:"remove", subject:"poll", entity:'basePoll', expected: true },
  ];

  useCases.forEach((useCase) => {

    it(`Logged In User -> Attemps to ${useCase.action} ${useCase.subject} (${useCase.entity}), expected: ${useCase.expected}`, async () => { await runPermissionsTest(
      useCase.action,
      useCase.subject,
      useCase.expected,
      useCase.entity
    );
    });


  });
});
