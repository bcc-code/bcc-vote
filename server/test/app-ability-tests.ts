import 'mocha'
import { assert } from 'chai';
import { importDB } from '@bcc-code/arango-migrate';
import { getAranoDBConfigFromFeathers, pollingEventsTestSet }  from './setup-tests/test-set'
import { subject } from '@casl/ability';
import { defineAbilityFor,subjects,actions  } from '../src/permissions/appAbility'

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
    testSet = pollingEventsTestSet()
  });

  const runPermissionsTest = async function (action:actionsType, onEntity:any, expected: boolean, entity:any="", changedData:any="") {

    const ability = defineAbilityFor(await testSet.user())

    try {
      let result:boolean = false;
      switch (action) {
        case "create":
          result = ability.can(action,onEntity)
          break;
        case "get":
          result = ability.can(action,subject(onEntity, testSet[entity]))
          break;
        case "patch":
          let entityWithChanges = testSet[entity]

          result = ability.can(action,subject(onEntity,entityWithChanges))
          break;
        case "find":
          result = ability.can(action,subject(onEntity,testSet[entity]))
          break;
        case "remove":
          result = result = ability.can(action,onEntity)
          break;
        default:
          throw Error("unknown action")
      }

    // Assert
     assert.equal(result, expected)
    } catch (error) {
      console.error(error)
      assert.fail(error.messaage)
    }

  }


  interface useCaseType {
    action:actionsType,
    subject: subjectType,
    expected:boolean,
    field?:any,
    entity?:string
 }

  var useCases:Array<useCaseType> = [
    { action:"find", subject:"polling-event", entity:'scopedToLocalChurch', expected: true }
 ]

 useCases.forEach((useCase) => {

  it(`Logged In User -> Attemps to ${useCase.action} ${useCase.subject} (${useCase.entity}), expected: ${useCase.expected}`, async () => { await runPermissionsTest(
      useCase.action,
      useCase.subject,
      useCase.expected,
      useCase.entity
    )
  })


});
});
