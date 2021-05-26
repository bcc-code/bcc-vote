import { ServiceAddons, Params } from '@feathersjs/feathers';
import {
  AuthenticationService,
  JWTStrategy,
  AuthenticationRequest,
} from "@feathersjs/authentication";
import { expressOauth, OAuthStrategy, OAuthProfile } from '@feathersjs/authentication-oauth';

import { NotAuthenticated } from '@feathersjs/errors';

import { Application } from './declarations';
declare module './declarations' {
  interface ServiceTypes {
    'authentication': AuthenticationService & ServiceAddons<any>;
  }
}
class Auth0Strategy extends OAuthStrategy {
  async authenticate(authentication: AuthenticationRequest, originalParams: Params) {
    const entity: string = this.configuration.entity;
    const { provider, ...params } = originalParams;
    const profile = await this.getProfile(authentication,params)
    const personID = profile["https://login.bcc.no/claims/personId"];
    
    const personSvc = this.app?.services.users;
    let person;
    const tryFind = await personSvc.find({
      query: {
        $limit: 1,
        personID: personID
      }
    });
    if(tryFind.total == 0){
      person = await personSvc.create({
        personID: personID,
      });
    }else{
      person = tryFind.data[0];
    }
    const memberSvc = this.app?.services.members;
    const allInfo = await memberSvc.get(person.personID);
    allInfo._id = person._id;
    return {
      authentication: { strategy: this.name ? this.name : 'unknown' },
      [entity]: allInfo
    };
  }
}

class CustomJWtStrategy extends JWTStrategy {
  async getEntity(id: any, params: any) {
    const personService = this.app?.services.users
    try {
      id = id.split('/')[1];
      const user = await personService.get(id, {});
      return user;
    } catch (err){
      throw new NotAuthenticated(`Could not find the User entity, try re-logging in.`);
    }
  }

  

  async authenticate(authentication: AuthenticationRequest, params: Params) {
    const { accessToken } = authentication;


    if (!accessToken) {
      throw new NotAuthenticated('No access token');
    }

    try {
      const payload = await this.authentication?.verifyAccessToken(accessToken, params.jwt);
      const localID = payload.sub.split('/')[1];
      const user = await this.app?.service('users').get(localID);
      const personID = user.personID; 
      const person = await this.app?.services.members.get(personID);
      person._id = localID;
      return {
        user: person,
        accessToken,
        authentication: {
          strategy: 'jwt',
          accessToken,
          payload
        }
      };
    } catch (error) {
      return await super.authenticate(authentication,params);
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
