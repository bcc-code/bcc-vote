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
        name: 'Create Event',
        component: async() => require('../views/PollingEventCreate.vue')
    }, 
    {
        name: 'Administrate Event',
        path: '/polling-event/admin/:id',
        component: async() => require('../views/AdminEvent.vue'),
    },
    {
        name: 'Event Lobby',
        path: '/polling-event/lobby/:id',
        component: async() => require('../views/Lobby.vue'),
        meta: {
            bgColor: "bg-blue-900"
        }
    },
    {
        name: 'Event live results',
        path: '/polling-event/live-results/:id',
        component: async() => require('../views/LiveResults.vue')
    },
    {
        name: 'Thank you page',
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
        component: async() => require('../views/Error.vue'),
        meta: {
            unprotected: true 
        }
    }
]
