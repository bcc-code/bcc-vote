import { ServiceAddons, Params } from '@feathersjs/feathers';
import {
  AuthenticationService,
  JWTStrategy,
  AuthenticationRequest,
} from "@feathersjs/authentication";
import { LocalStrategy } from '@feathersjs/authentication-local';
import { expressOauth, OAuthStrategy, OAuthProfile } from '@feathersjs/authentication-oauth';

import { NotAuthenticated } from '@feathersjs/errors';

import { Application } from './declarations';
import services from './services';

import jsonwebtoken, { SignOptions, Secret, VerifyOptions } from 'jsonwebtoken';

declare module './declarations' {
  interface ServiceTypes {
    'authentication': AuthenticationService & ServiceAddons<any>;
  }
}
class Auth0Strategy extends OAuthStrategy {
  // async getEntityData(profile: OAuthProfile, existing: any, params: Params) {
  //   const baseData = await super.getEntityData(profile, existing, params)
  //   console.log(profile);
  //   // console.log(existing);
  //   // console.log(params);
  //   return {
  //     ...baseData,
  //     name: profile.name,
  //     email: profile.email,
  //     birthdate: profile.birthdate,
  //     churchName: profile['https://login.bcc.no/claims/churchName']
  //   };
  // }
  async authenticate(authentication: AuthenticationRequest, originalParams: Params) {
    const entity: string = this.configuration.entity;
    const { provider, ...params } = originalParams;
    const profile = await this.getProfile(authentication,params)
    const personID = profile["https://login.bcc.no/claims/personId"];
    // console.log(profile);
    const personSvc = this.app?.services.users;
    let person;
    let tryFind = await personSvc.find({
      query: {
        $limit: 1,
        personID: personID
      }
    })
    if(tryFind.total == 0){
      person = await personSvc.create({
        personID: personID,
        email: profile.email,
        name: profile.name,
        churchName: profile["https://login.bcc.no/claims/churchName"]
      })
    }else{
      person = tryFind.data[0];
    }
    // const person = await personSvc.create({
    //   auth0Id: profile.sub,
    //   email: profile.email,
    //   myId: personID
    // })
    console.log(person);
    return {
      authentication: { strategy: this.name ? this.name : 'unknown' },
      [entity]: person
    }
  }
}

// function verifyAuth0AccessToken(accessToken:string):{[key:string]:any}{
//   console.log('verifying');
//   var fs = require('fs');
//   const publicKey = fs.readFileSync(`../config/development-public.key`)
//   console.log('publicKey');
//   accessToken = accessToken.replace("Bearer ","");
//   const payload = <object>jsonwebtoken.verify(accessToken, publicKey);
//   return payload
// }

class CustomJWtStrategy extends JWTStrategy {
  async getEntity(id: any, params: any) {
    const personService = this.app?.services.users
    console.log(id);
    try {
      id = id.split('/')[1];
      const user = await personService.get(id, {});
      return user;
    } catch (err){
      console.log(err);
      throw new NotAuthenticated(`Could not find the User entity, try re-logging in.`);
    }
  }

  

  // async authenticate(authentication: AuthenticationRequest, params: Params) {
  //   let { accessToken } = authentication;
  //   console.log('authenticating JWT token');

  //   if (!accessToken) {
  //     throw new NotAuthenticated('No access token');
  //   }

  //   try {
  //     console.log('trying to verify');
  //     let payload = verifyAuth0AccessToken(accessToken)
  //     const personID = payload["https://login.bcc.no/claims/personId"]
  //     console.log(personID);
  //     const user =  await this.app?.services.users.find({query:{personID:personID}}).data[0]
  //     console.log(user);
  //     return {
  //       user,
  //       accessToken,
  //       authentication: {
  //           strategy: 'jwt',
  //           accessToken,
  //           payload
  //         }
  //       }
  //   } catch (error) {
  //     return await super.authenticate(authentication,params)
  //   }
  // }
}

export default function(app: Application) {
  const authentication = new AuthenticationService(app);

  authentication.register('jwt', new CustomJWtStrategy());
  authentication.register('local', new LocalStrategy());
  console.log('using auth0 strategy');
  authentication.register('auth0', new Auth0Strategy());

  app.use('/authentication', authentication);
  app.configure(expressOauth());
}
