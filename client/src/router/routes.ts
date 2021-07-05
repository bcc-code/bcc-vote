import { RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: async() => import('../views/Home.vue' as string),
        meta: {
            bgColor: "bg-white"
        }
    },
    {
        path: '/create',
        name: 'Create Event',
        component: async() => import('../views/PollingEventCreate.vue' as string)
    }, 
    {
        name: 'Administrate Event',
        path: '/polling-event/admin/:id',
        component: async() => import('../views/AdminEvent.vue' as string),
    },
    {
        name: 'Event Lobby',
        path: '/polling-event/lobby/:id',
        component: async() => import('../views/Lobby.vue' as string),
        meta: {
            bgColor: "bg-blue-900"
        }
    },
    {
        name: 'Event live results',
        path: '/polling-event/live-results/:id',
        component: async() => import('../views/LiveResults.vue' as string)
    },
    {
        name: 'Thank you',
        path: '/thank-you',
        component: async() => import('../views/ThankYou.vue' as string),
        meta: {
            bgColor: "bg-blue-900"
        }
    },
    {
        name: 'Poll result',
        path: '/poll/result/:id',
        component: async() => import('../views/AdminPollResult.vue' as string),
        meta: {
            bgColor: "bg-blue-900"
        }
    },
    {
        path: '/error-:message',
        name: 'Error page',
        component: async() => import('../views/Error.vue' as string),
        meta: {
            unprotected: true 
        }
    }
]
