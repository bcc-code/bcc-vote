import 'mocha';
import { assert } from 'chai';
import app from '../src/app';
import { getAranoDBConfigFromFeathers }  from './setup-tests/test-set';
import { getUserBasedOnPayLoad } from '../src/services/authentication/authentication-helpers';
import { User } from '../src/domain';
import { importDB} from "@bcc-code/arango-migrate";

describe('Authentication', async () => {
    beforeEach(async ()=>{
        await importDB(getAranoDBConfigFromFeathers(),true,false);
    });

    it('Get a User', async () => {
        try {
            const getUser = await app.services.person.get("54512",{}) as any;
            assert.equal(getUser._key,"54512");
        } catch (error) {
            assert.fail('Could find a user through the person service');
        }
    });

    it('Get a logged in user based on a jwt payload', async () => {
        try {
            const jwtPayload: Record<string, any> = {
                'https://login.bcc.no/claims/personId': 54512,
                iat: Date.now()
            };

            const authenticatedUser = await getUserBasedOnPayLoad(jwtPayload, app);
            assert.equal(jwtPayload.iat, authenticatedUser.authTime);
            assert.equal(authenticatedUser.displayName, "Philly Daly");
            assert.equal(authenticatedUser.personID, 54512);

        } catch (error) {
            assert.fail(`Couldnt get a user a user based on a jwt payload ${error}`);
        }
    });

    it('Save a logged in user based on a jwt payload', async () => {
        try {
            const jwtPayload: Record<string, any> = {
                'https://login.bcc.no/claims/personId': 54512,
                iat: Date.now()
            };

            const authenticatedUser = await getUserBasedOnPayLoad(jwtPayload, app);

            const savedUser = await app.services.user.get(authenticatedUser._key,{}) as User;
            assert.equal(jwtPayload.iat, savedUser.authTime);

        } catch (error) {
            assert.fail(`User was not saved correctly ${error}`);
        }
    });

    it('User reauthenticating after login does not get saved', async () => {
        try {
            const jwtPayload: Record<string, any> = {
                'https://login.bcc.no/claims/personId': 54512,
                iat: Date.now() - (30000) //30 seconds ago
            };

            const authenticatedUser = await getUserBasedOnPayLoad(jwtPayload, app);
            assert.equal(jwtPayload.iat, authenticatedUser.authTime);
            
            const savedUser = await app.services.user.get(authenticatedUser._key,{}) as User;
            assert.notEqual(jwtPayload.iat, savedUser.authTime);
        } catch (error) {
            assert.fail(`User was not saved correctly ${error}`);
        }
    });

    it('User logged in before without saved user gets stored', async () => {
        await app.services.user.remove('54512',{});
        
        try {
            const jwtPayload: Record<string, any> = {
                'https://login.bcc.no/claims/personId': 54512,
                iat: Date.now() - (60000) //1 minute ago
            };

            const authenticatedUser = await getUserBasedOnPayLoad(jwtPayload, app);
            assert.equal(jwtPayload.iat, authenticatedUser.authTime);
            
            const savedUser = await app.services.user.get(authenticatedUser._key,{}) as User;
            assert.equal(jwtPayload.iat, savedUser.authTime);
        } catch (error) {
            assert.fail(`User was not saved correctly ${error}`);
        }
    });
});
