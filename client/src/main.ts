
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
import { logConnectionsToSentry, logToSentry } from './functions/sentry';
import vueGtag from 'vue-gtag';
import {AuthenticationResult} from '@feathersjs/authentication';
import i18n from './i18n';
import mixins from './mixins';
import hooks from './hooks';
import { setupAuth0, authenticate, verifyAccessToken } from './auth0';

const app = createApp(App);
const client = feathers();
const socket = io(window.location.hostname === 'localhost' ? 'http://localhost:4040' : `${location.origin}`, {
    transports: ['websocket', 'polling'],
});

socket.on('connect_error', (err: Error) => {
    logToSentry(err);
});

socket.on('reconnect', async() => {
    await verifyAccessToken(client);
    location.reload();
});

client.configure(socketio(socket));
logConnectionsToSentry(client);
client.hooks(hooks);

window.onload = async () => {
    const auth0Client = await setupAuth0();
    client.set('auth0', auth0Client);

    await authenticate(app, client, registerVue);
};

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

export default app;

