import { captureException, setTag, addBreadcrumb, Severity } from '@sentry/browser';
import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";
import { App } from 'vue';
import { Router } from 'vue-router';

export const initSentry = (app: App<Element> , router: Router):void =>{
    Sentry.init({
        app,
        dsn: "https://de460cd536b34cdab822a0338782e799@o879247.ingest.sentry.io/5831770",
        integrations: [
            new BrowserTracing({
                routingInstrumentation: Sentry.vueRouterInstrumentation(router),
                tracingOrigins: ["localhost", "vote.bcc.no", "dev.vote.bcc.no", "beta.vote.bcc.no",/^\//],
            }),
        ],
        tracesSampleRate: 1.0,
    });
};

export const logToSentry = (error: Error, role?: string ): void => {
    if(role){
        setTag('activeRole', role);
    }
    captureException(error);
};

export const createBreadcrumb = (category: string, data: any, message: string): void => {
    let severityLevel = Severity.Info;
    if(message.includes('error'))
        severityLevel = Severity.Error;
    addBreadcrumb({
        category: category,
        message: message,
        data: data,
        level: severityLevel
    });
};

export const logConnectionsToSentry = (client: any): void => {
    const allServiceEvents = [
        {service: 'polling-event', event: 'patched'},
        {service: 'answer', event: 'created'},
        {service: 'poll-result', event: 'patched'},
        {service: 'poll', event: 'patched'},
    ];

    const allConnectionEvents = [
        'connect_error',
        'connect_timeout',
        'reconnect', 
        'reconnect_attempt', 
        'reconnecting', 
        'reconnect_error', 
        'reconnect_failed', 
        'ping'
    ];

    allServiceEvents.forEach((eventType: any) => {
        client.service(eventType.service).on(eventType.event, (event: any) => {
            createBreadcrumb('socket.io', event, '[Socket Event]: '+eventType.service+' '+eventType.event);
        });
    });

    allConnectionEvents.forEach((connectionEvent: string) => {
        client.io.on(connectionEvent, (event: any) => {
            createBreadcrumb('socket.io', event, '[Socket Event]: '+connectionEvent);
        });
    });
};
