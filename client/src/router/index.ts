import { createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized, Router } from 'vue-router';
import { routes } from './routes';
import { logToSentry } from '../functions/sentry';
import { User } from '../domain';
import { VueGtag } from 'vue-gtag';
import { Application } from '@feathersjs/feathers';

interface CustomRouter extends Router {
    $gtag?: VueGtag;
    $user?: User;
    $client?: Application
}

const router: CustomRouter = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.beforeEach(async(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if(router.$gtag)
        router.$gtag.event('page_view', {'page_title': to.name});
    if(to.meta.unprotected){
        next();
    }else {
        try {
            const authenticationResult = await router.$client?.reAuthenticate();
            if(!authenticationResult) throw Error("Couldn't authenticate");
            const user = authenticationResult.user;
            const formattedUser: User = {
                _key: user._key,
                _id: user._id,
                displayName: user.displayName,
                age: user.age,
                churchID: user.churchID,
                personID: user.personID,
                roles: user.roles,
                activeRole: user.activeRole
            };
            router.$user = formattedUser;
            next();
        } catch(error) {
            if(!(error instanceof Error)) return;
            const authEndpoint = window.location.hostname === 'localhost' ? 'http://localhost:4040/oauth/auth0' : `${location.origin}/oauth/auth0/`;
            const requiresAuth = error.message === "No accessToken found in storage" || error.message.includes('jwt');
            if(requiresAuth) {
                location.href = authEndpoint;
                next(false);
            } else {
                logToSentry(error);
                next({ path: "/error-"+error.message});
            }
        }
    }
});

router.afterEach(() => {
    const hash = window.location.hash;
    if (hash.includes("access_token")) window.location.hash = "";
});

export default router;
