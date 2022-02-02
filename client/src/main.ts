import appInsights from './appInsightsTelemetry';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import Toast from 'vue-dk-toast';
import Spinner from '@/components/spinner.vue';
import InfoBox from '@/components/info-box.vue';
import './assets/style.css';
import App from './App.vue';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import auth from '@feathersjs/authentication-client';
import io from 'socket.io-client';
import { Role } from './domain/User';
import { store } from './store';
import router from './router';
import { init } from '@sentry/browser';
import { logConnectionsToSentry, createBreadcrumb } from './functions/sentry';
import vueGtag from 'vue-gtag';
import determineConfigBasedOnEnvironment from './config';
import i18n from './i18n';
import mixins from './mixins';

const startupTime = new Date().getTime();

const app = createApp(App);


const client = feathers();
const socket = io(window.location.hostname === 'localhost' ? 'http://localhost:4040' : `${location.origin}`, {
    transports: ['websocket', 'polling'],
});

client.configure(socketio(socket));
client.configure(auth());

logConnectionsToSentry(client);


client.hooks({
    before: {
        all: [
            (context: any) => {
                if (app.config.globalProperties.$gtag)
                    app.config.globalProperties.$gtag.event(context.method + ' ' + context.path);
            },
        ],
    },
    after: {
        all: [
            (context: any) => {
                let data = context.result;
                if (context.path === 'authentication') data = context.result.user;

                createBreadcrumb('Request', data, context.method + ' ' + context.path);
            },
        ],
    },
});

function registerVue() {
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
    const user = {
        age: null,
        churchID: null,
        personID: null,
        roles: null,
        activeRole: '',
    };
    
    router.$client = client;
    store.$client = client;
    router.$user = user;
    router.$gtag = app.config.globalProperties.$gtag;
    app.config.globalProperties.$client = client;
    app.config.globalProperties.$user = user;
    
    
    app.mount('#app');
}

document.title = 'BCC Vote';
registerVue();
window.onload = async () => {
    const startupDuration = new Date().getTime() - startupTime;
    appInsights.trackMetric({name: 'appStarted', average: startupDuration});
};
