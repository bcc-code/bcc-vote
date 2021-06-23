import { RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: async() => require('../views/Home.vue'),
        meta: {
            bgColor: "bg-white"
        }
    },
    {
        path: '/create',
        name: 'Create a Polling event',
        component: async() => require('../views/PollingEventCreate.vue')
    }, 
    {
        name: 'Administrate the Live polling event',
        path: '/polling-event/admin/:id',
        component: async() => require('../views/AdminEvent.vue'),
    },
    {
        name: 'Polling event lobby',
        path: '/polling-event/lobby/:id',
        component: async() => require('../views/Lobby.vue'),
        meta: {
            bgColor: "bg-blue-900"
        }
    },
    {
        name: 'Polling event live results',
        path: '/polling-event/live-results/:id',
        component: async() => require('../views/LiveResults.vue')
    },
    {
        name: 'Thank you for participating',
        path: '/thank-you/:title',
        component: async() => require('../views/ThankYou.vue'),
        meta: {
            bgColor: "bg-blue-900"
        }
    },
    {
        name: 'Poll result',
        path: '/poll/result/:id',
        component: async() => require('../views/AdminPollResult.vue'),
        meta: {
            bgColor: "bg-blue-900"
        }
    },
    {
        name: 'logout',
        path: "/logout",
        component: {},
        meta: {
            logout: true 
        }
    },
    {
        path: '/error-:message',
        name: 'error',
        component: async() => require('../views/Error.vue'),
        meta: {
            unprotected: true 
        }
    }
]
