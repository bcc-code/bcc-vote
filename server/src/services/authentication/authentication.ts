import { ServiceAddons, Params, Paginated } from "@feathersjs/feathers";
import { verifyAuth0AccessToken, getRolesForPerson } from "./authentication-helpers"
import {
  AuthenticationService,
  AuthenticationRequest,
} from "@feathersjs/authentication";
import hooks from "./authentication.hooks";
import {
  expressOauth,
  OAuthStrategy,
} from "@feathersjs/authentication-oauth";
import { NotAuthenticated } from '@feathersjs/errors';
import { Application } from "../../declarations";
import { Person } from "../person/person.class";
const speakeasy = require('speakeasy');

declare module "../../declarations" {
  interface ServiceTypes {
    authentication: AuthenticationService & ServiceAddons<any>;
  }
}

class Auth0Strategy extends OAuthStrategy {
  async authenticate(authentication: AuthenticationRequest, originalParams: Params) {
    const entity: string = this.configuration.entity;
    const { provider, ...params } = originalParams;
    const profile = await this.getProfile(authentication,params)
    const personID = profile["https://login.bcc.no/claims/personId"];
    const personSvc = this.app?.services.person as Person;

    // We should not select the related items to be saved to User aswell.
    // This will make the object a lot bigger than needed.
    const p = ((await personSvc.find({ query: { $limit: 10,
                                                personID: personID
                                              }
                                      })) as Paginated<any>).data;
    if (Array.isArray(p) && p.length == 1) {
      const person = p[0];
      let fieldsToUpdatePersonWith:any = {}

      person.roles = await getRolesForPerson(person);
      const highestAuthorityRole = person.roles[0]
      if(!person.activeRole){
        person.activeRole = highestAuthorityRole.enumName
        fieldsToUpdatePersonWith.activeRole = person.activeRole
      }

      if(!person.secretInUse) {
        person.tempSecret = speakeasy.generateSecret({ name:'Membership System'})
        fieldsToUpdatePersonWith.tempSecret = person.tempSecret
      }
      person.verifiedCode = null
      fieldsToUpdatePersonWith.verifiedCode = null;

      if(Object.keys(fieldsToUpdatePersonWith).length){
        await personSvc.patch(person._key, fieldsToUpdatePersonWith, params);
      }


      return {
        authentication: { strategy: this.name ? this.name : 'unknown' },
        [entity]: person
      }
    }
    else throw new NotAuthenticated('Person logging in was not found in system');
  }
}



export default function (app: Application) {
  const authentication = new AuthenticationService(app);

  authentication.register("auth0", new Auth0Strategy());

  app.use("/authentication", authentication);

  const service = app.service("authentication");
  service.hooks(hooks);

  app.configure(expressOauth());
}
