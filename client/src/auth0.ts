import createAuth0Client, { Auth0Client } from '@auth0/auth0-spa-js';
import determineConfigBasedOnEnvironment from './config';

const config = determineConfigBasedOnEnvironment();

export async function setupAuth0(): Promise<Auth0Client> {
    const auth0 = await createAuth0Client({
        domain: config.auth0Domain,
        client_id: config.auth0ClientId,
        redirect_uri: config.auth0RedirectUri,
        cacheLocation: 'localstorage',
        audience: config.audience
    });
    return auth0;
}
