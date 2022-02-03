
import { createApp } from 'vue';
import Toast from 'vue-dk-toast';
import Spinner from '@/components/spinner.vue';
import InfoBox from '@/components/info-box.vue';
import './assets/style.css';
import App from './App.vue';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import io from 'socket.io-client';
import { store } from './store';
import router from './router';
import { init, User } from '@sentry/browser';
import { logConnectionsToSentry } from './functions/sentry';
import vueGtag from 'vue-gtag';
import auth from '@feathersjs/authentication-client';
import {AuthenticationResult} from '@feathersjs/authentication';

import i18n from './i18n';
import mixins from './mixins';
import createAuth0Client, { Auth0Client, RedirectLoginOptions } from '@auth0/auth0-spa-js';
import determineConfigBasedOnEnvironment from './config';

const app = createApp(App);
const config = determineConfigBasedOnEnvironment();

const client = feathers();
const socket = io(window.location.hostname === 'localhost' ? 'http://localhost:4040' : `${location.origin}`, {
    transports: ['websocket', 'polling'],
});

client.configure(socketio(socket));
logConnectionsToSentry(client);

window.onload = async () => {
    await setupAuth0(client);

    const auth0 = (await client.get('auth0')) as Auth0Client;
    let redirectUrl = '';
    const query = window.location.search;
    if (query.includes('code=') && query.includes('state=')) {
        // Process the login state
        console.log(query);
        const options = await auth0.handleRedirectCallback();
        console.log(options)
        redirectUrl = options.appState.targetUrl;
        // Use replaceState to redirect the user away and remove the querystring parameters
    }
    if (await auth0.isAuthenticated()) {
        console.log()
        client.configure(auth({storage: window.sessionStorage}));
        const accessToken = await auth0.getTokenSilently();
        client.authentication.setAccessToken(accessToken);
        const authResult = await client.reAuthenticate(true);
        registerVue(authResult);

        if (redirectUrl) {
            const router = app.config.globalProperties.$router;
            router.push(redirectUrl);
        }
    } else {
        const options: RedirectLoginOptions = {
            appState: {targetUrl: location.pathname + location.search},
            //scope: 'members.mfa',
        };
        console.log(options)
        await auth0.loginWithRedirect(options);
    }
}

function registerVue(authResult: AuthenticationResult) {
    const user = authResult.user as User;
    app.component('Spinner', Spinner);
    app.component('InfoBox', InfoBox);
    app.use(Toast, { duration: 2000, positionX: 'right', positionY: 'bottom' });
    app.use(i18n);
    app.use(router);
    app.use(store);

    app.mixin(mixins);
    
    if (window.location.hostname === 'vote.bcc.no') {
        app.use(vueGtag, {
            // for testing locally or in dev use G-4KNVYNZ55W
            config: { id: 'G-6V21WXD03F' },
        });
    
        init({ dsn: 'https://de460cd536b34cdab822a0338782e799@o879247.ingest.sentry.io/5831770' });
    }
    
    router.$client = client;
    store.$client = client;
    router.$user = authResult.user;
    router.$gtag = app.config.globalProperties.$gtag;
    app.config.globalProperties.$client = client;
    app.config.globalProperties.$user = user;
    
    app.mount('#app');
}

async function setupAuth0(client: feathers.Application) {
    const auth0 = await createAuth0Client({
        domain: config.auth0Domain,
        client_id: config.auth0ClientId,
        redirect_uri: config.auth0RedirectUri,
        cacheLocation: 'localstorage',
        audience: 'bcc.members'
    });
    client.set('auth0', auth0);
}

