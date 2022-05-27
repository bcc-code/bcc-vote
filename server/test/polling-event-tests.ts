import 'mocha';
import { assert } from 'chai';
import app from '../src/app';
import { getAranoDBConfigFromFeathers, pollingEventsTestSet }  from './setup-tests/test-set';
import { importDB} from "@bcc-code/arango-migrate";
import { PollingEvent } from '../src/domain/PollingEvent';
import { User } from '../src/domain';
import { defineAbilityFor } from '../src/permissions/appAbility';
import { subject } from '@casl/ability';


describe('polling-event', async () => {
    let testSet:any;

    beforeEach(async ()=>{
        await importDB(getAranoDBConfigFromFeathers(),false,false);
        testSet = pollingEventsTestSet();
    });

    it('Get a list of all poling events', async () => {

        try {
            const events = await app.services['polling-event'].find({}) as any[];
            assert.isTrue(events.length > 0);
        } catch (error) {
            assert.fail('It was not possible to retrieve a list of all polling events');
        }

    });

    it('Polling event with min-age should be visible to user of that age', async () => {
        try {
            const user = await testSet.user() as User;
            const event = await testSet.scopedToLocalChurchSameAsLoggedInUser() as PollingEvent;

            event.participantFilter.minAge = user.age;

            const ability = defineAbilityFor(user);
            const canFindEvent = ability.can('find', subject("polling-event", event));
            const canGetEvent = ability.can('get', subject("polling-event", event));

            assert.equal(canFindEvent, true);
            assert.equal(canGetEvent, true);
        } catch (error) {
            assert.fail('It was not possible to retrieve the event for user', error.message);
        }
    });

    it('Polling event with max-age should be visible until age of user', async () => {
        try {
            const user = await testSet.user() as User;
            const event = await testSet.scopedToLocalChurchSameAsLoggedInUser() as PollingEvent;

            event.participantFilter.maxAge = user.age;
            const eventSubject = subject("polling-event", event);

            const ability = defineAbilityFor(user);
            assert.equal(ability.can('find', eventSubject), true);
            assert.equal(ability.can('get', eventSubject), true);

            user.age++;
            const abilityTooOld = defineAbilityFor(user);
            assert.equal(abilityTooOld.can('find', eventSubject), false);
            assert.equal(abilityTooOld.can('get', eventSubject), false);
        } catch (error) {
            assert.fail('The right events where not retrieved for the user: ' + error.message);
        }
    });
});
