import { ServiceAddons, Params } from '@feathersjs/feathers';
import {
    AuthenticationService,
    JWTStrategy,
    AuthenticationRequest,
} from "@feathersjs/authentication";
import { expressOauth, OAuthStrategy, OAuthProfile } from '@feathersjs/authentication-oauth';
import { NotAuthenticated } from '@feathersjs/errors';
import { Application } from '../../declarations';
import pick from 'lodash/pick';
import { getActiveRole } from './authentication-helpers';
import logger from '../../logger';
import promiseWithTimeout from '../../utils/promiseWithTimeout';
declare module '../../declarations' {
  interface ServiceTypes {
    'authentication': AuthenticationService & ServiceAddons<any>;
  }
}
class Auth0Strategy extends OAuthStrategy {
    async authenticate(authentication: AuthenticationRequest, originalParams: Params) {
        logger.info(`AUTHENTICATE METHOD: Starting authentication flow`);
        const startTime = new Date();

        const entity: string = this.configuration.entity;
        const { ...params } = originalParams;
        const profile = await this.getProfile(authentication,params);
        const personID = profile["https://login.bcc.no/claims/personId"];

        let member:any = {};
        try {
            member = promiseWithTimeout(2000,
                (await this.app?.service('person').find({ query:{ personID: personID}})).data[0]
            );
            logger.info(`AUTHENTICATE METHOD: Member with PersonID ${member.personID} succesfully retrieved from the members api`);
            member = pick(member,['_id','_key','personID','churchID','related','email','cellPhone.formatted','church','displayName','age','related.roles', 'administrator']);

            member._id = `user/${member._key}`;
            member.roles = member.related.roles;
            member.activeRole = getActiveRole(member.related.roles);
            member.churchName = member.church.org.name;
            delete member.church;
            delete member.related;

            const existingUsers = (await this.app?.service('user').find({ query: { _key: member._key }})).data;

            if(existingUsers.length == 0) {
                await this.app?.service('user').create(member);
            } else if(existingUsers.length == 1) {
                await this.app?.service('user').update(member._key,member);
            }
        } catch (error) {
            logger.error(error.message);
            logger.info(`AUTHENTICATE METHOD: Failed to retrieve member with personID:${personID} from the members api, please check if the members api is available and configured correctly`);
            logger.info(`AUTHENTICATE METHOD: Trying to retrieve member with personID:${personID} from local database`);
            member = (await this.app?.service('user').find({ query:{ personID: personID}})).data[0];
            if(member == undefined){
                throw new Error(`AUTHENTICATE METHOD: Failed to retrieve member with personID:${personID} from the members api and local database, its is therefore not possible to log the user in`);
            }
            logger.info(`AUTHENTICATE METHOD: Member with PersonID ${personID} succesfully retrieved from the local user store. Please note that this is backup behaviour, the expected behaviour was that to retrieve the member from the members api.`);
        }

        const durationMs = new Date().getTime() - startTime.getTime();
        logger.info(`AUTHENTICATE METHOD: Authenticated in ${durationMs} ms`);
        return {
            authentication: { strategy: this.name ? this.name : 'unknown' },
            [entity]: member
        };
    }
}

class CustomJWtStrategy extends JWTStrategy {
    async getEntity(id: any, params: any) {
        const userService = this.app?.services.user;
        try {
            id = id.split('/')[1];
            const user = await userService.get(id, {});
            return user;
        } catch (err){
            throw new NotAuthenticated(`Could not find the User entity in the local database given the following _key:${id}`);
        }
    }
}

export default function(app: Application): void {
    const authentication = new AuthenticationService(app);

    authentication.register('jwt', new CustomJWtStrategy());
    authentication.register('auth0', new Auth0Strategy());

    app.use('/authentication', authentication);
    app.configure(expressOauth());
}
