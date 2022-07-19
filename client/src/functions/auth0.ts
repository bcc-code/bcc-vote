import createAuth0Client, { Auth0Client, RedirectLoginOptions } from '@auth0/auth0-spa-js';
import auth from '@feathersjs/authentication-client';
import { AuthenticationResult } from '@feathersjs/authentication';
import feathers from '@feathersjs/feathers';
import { App } from 'vue';
import determineConfigBasedOnEnvironment from '../config';

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

export async function authenticate(app: App<Element>, client: feathers.Application<any>, callback: (authResult: AuthenticationResult) => Promise<void>): Promise<void> {
    const auth0 = (await client.get('auth0')) as Auth0Client;
    let redirectUrl = '';
    const query = window.location.search;
    if (query.includes('code=') && query.includes('state=')) {
        const options = await auth0.handleRedirectCallback();
        redirectUrl = options.appState.targetUrl;
    }
    if (await auth0.isAuthenticated()) {
        client.configure(auth({ storage: window.sessionStorage }));
        const accessToken = await auth0.getTokenSilently();
        client.authentication.setAccessToken(accessToken);
        const authResult = await client.reAuthenticate(true);
        await callback(authResult);

        if (redirectUrl) {
            const router = app.config.globalProperties.$router;
            router.push(redirectUrl);
        }
    } else {
        const options: RedirectLoginOptions = {
            appState: { targetUrl: location.pathname + location.search },
        };
        await auth0.loginWithRedirect(options);
    }
}

export async function verifyAccessToken(app: feathers.Application<any>): Promise<void> {
    const auth0 = app.get('auth0') as Auth0Client;
    const accessToken = await auth0.getTokenSilently();

    if(app?.authentication) {
        const feathersToken = await app.authentication.getAccessToken();
        if (accessToken !== feathersToken) {
            app.authentication.setAccessToken(accessToken);
            await app.authentication.reAuthenticate(true);
        }
    } else {
        throw new Error('No authentication service found');
    }
    
}
