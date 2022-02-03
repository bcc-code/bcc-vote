import { ServiceAddons, Params } from '@feathersjs/feathers';
import {
    AuthenticationService,
    JWTStrategy,
    AuthenticationRequest,
} from "@feathersjs/authentication";
import { expressOauth} from '@feathersjs/authentication-oauth';
import { NotAuthenticated } from '@feathersjs/errors';
import { Application } from '../../declarations';
import { getUserBasedOnPayLoad, verifyAuth0AccessToken } from './authentication-helpers';
declare module '../../declarations' {
  interface ServiceTypes {
    'authentication': AuthenticationService & ServiceAddons<any>;
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
    async authenticate(authentication: AuthenticationRequest, params: Params) {
        const {accessToken} = authentication;
        if (!accessToken) {
            throw new NotAuthenticated('No access token');
        }

        try {
            const config = this.authentication?.configuration.oauth.auth0;
            const payload = await verifyAuth0AccessToken(accessToken, config.jwks, config.issuer);
            const user = (await getUserBasedOnPayLoad(payload, this.app));
            
            const authResult = {
                user,
                accessToken,
                authentication: {
                    strategy: 'jwt',
                    accessToken,
                    payload,
                },
            };
            if (params.connection) {
                params.connection.authentication = authResult.authentication;
            }
            console.log(authResult)

            return authResult;
        } catch (error) {
            console.log(
                'There was an error trying to authenticate using the jwt strategy, it is likely related to verifying the access token.'
            );
            throw error;
        }
    }
}
class CustomAuthentication extends AuthenticationService {
    async handleConnection(event: any, connection: any, authResult: any) {
        // We don't handle the connection here, because because we check authentication during every request.
    }
}


export default function(app: Application): void {
    const authentication = new CustomAuthentication(app);

    authentication.register('jwt', new CustomJWtStrategy());

    app.use('/authentication', authentication);
    app.configure(expressOauth());
}
