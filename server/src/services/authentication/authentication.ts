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
import { getRolesForPerson } from './authentication-helpers'
declare module '../../declarations' {
  interface ServiceTypes {
    'authentication': AuthenticationService & ServiceAddons<any>;
  }
}
class Auth0Strategy extends OAuthStrategy {
    async authenticate(authentication: AuthenticationRequest, originalParams: Params) {
        const entity: string = this.configuration.entity;
        const { ...params } = originalParams;
        const profile = await this.getProfile(authentication,params);
        const personID = profile["https://login.bcc.no/claims/personId"];
        try {
            const userSvc = this.app?.services.user;
            const memberSvc = this.app?.services.person;
            let member = (await memberSvc.find({ query:{ personID: personID}})).data[0];

            console.log(`Member with PersonID ${member.personID} succesfully retrieved from the members api`);

            member = pick(member,['_id','_key','personID','churchID','related','email','cellPhone.formatted','church','displayName','age','roles', 'administrator']);


            member._id = `user/${member._key}`;
            member.roles = getRolesForPerson(member);
            member.churchName = member.church.org.name;
            const highestLevelRole = member.roles[0];
            member.activeRole = highestLevelRole.enumName;
            delete member.church;
            delete member.related;

            const existingUsers = (await userSvc.find({ query: { _key: member._key }})).data;

            if(existingUsers.length == 0) {
                await userSvc.create(member);
            } else if(existingUsers.length == 1) {
                await userSvc.update(member._key,member);
            }
            return {
                authentication: { strategy: this.name ? this.name : 'unknown' },
                [entity]: member
            };
        } catch(err) {
            throw new Error('Login not possible');
        }
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
