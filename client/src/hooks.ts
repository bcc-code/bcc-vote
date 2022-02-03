import { HookContext } from "@feathersjs/feathers";
import { createBreadcrumb } from "./functions/sentry";
import app from './main';
import {stripSlashes} from '@feathersjs/commons';
import {Auth0Client} from '@auth0/auth0-spa-js';

export const verifyAccessToken = async (context: HookContext):Promise<HookContext> => {
    const {
        app,
        path,
        method,
        app: {authentication: service},
    } = context;

    if (stripSlashes(service.options.path) === path && (method === 'create' || method === 'remove')) {
        return context;
    }

    const auth0 = app.get('auth0') as Auth0Client;
    const accessToken = await auth0.getTokenSilently();

    const feathersToken = await app.authentication.getAccessToken();
    if (accessToken !== feathersToken) {
        app.authentication.setAccessToken(accessToken);
        await app.authentication.reAuthenticate(true);
    }

    return context;
};

const logEventToGoogleAnalytics = (context: HookContext):HookContext => {
    if (app.config.globalProperties.$gtag)
        app.config.globalProperties.$gtag.event(context.method + ' ' + context.path);
    return context;
};

const addSentryBreadcrumb = (context: HookContext):HookContext => {
    let data = context.result;
    if (context.path === 'authentication') data = context.result.user;

    createBreadcrumb('Request', data, context.method + ' ' + context.path);
    return context;
};

export default {
    before: {
        all: [logEventToGoogleAnalytics, verifyAccessToken],
    },
    after: {
        all: [addSentryBreadcrumb],
    },
};
