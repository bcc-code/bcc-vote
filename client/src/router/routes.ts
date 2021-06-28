import { RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: () => require('../views/Home.vue'),
        meta: {
            bgColor: "bg-white"
        }
    },
    {
        path: '/create',
        name: 'Create Event',
        component: () => require('../views/PollingEventCreate.vue')
    }, 
    {
        name: 'Administrate Event',
        path: '/polling-event/admin/:id',
        component: () => require('../views/AdminEvent.vue'),
    },
    {
        name: 'Event Lobby',
        path: '/polling-event/lobby/:id',
        component: () => require('../views/Lobby.vue'),
        meta: {
            bgColor: "bg-blue-900"
        }
    },
    {
        name: 'Event live results',
        path: '/polling-event/live-results/:id',
        component: () => require('../views/LiveResults.vue')
    },
    {
        name: 'Thank you',
        path: '/thank-you',
        component: () => require('../views/ThankYou.vue'),
        meta: {
            bgColor: "bg-blue-900"
        }
    },
    {
        name: 'Poll result',
        path: '/poll/result/',
        component: () => require('../views/AdminPollResult.vue'),
        meta: {
            bgColor: "bg-blue-900"
        }
    },
    {
        name: 'Logout',
        path: "/logout",
        component: {},
        meta: {
            logout: true 
        }
    },
    {
        path: '/error-:message',
        name: 'Error page',
        component: () => require('../views/Error.vue'),
        meta: {
            unprotected: true 
        }
    }
]
