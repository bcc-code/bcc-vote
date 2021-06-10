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
        name: 'Create a Polling event',
        component: () => require('../views/PollingEventCreate.vue')
    }, 
    {
        name: 'Administrate the Live polling event',
        path: '/polling-event/admin/:id',
        component: () => require('../views/AdminEvent.vue'),
    },
    {
        name: 'Polling event lobby',
        path: '/polling-event/lobby/:id',
        component: () => require('../views/ParticipantLobby.vue'),
        meta: {
            bgColor: "bg-blue-900"
        }
    },
    {
        name: 'Polling event live results',
        path: '/polling-event/live-results/:id',
        component: () => require('../views/LiveResults.vue')
    },
    {
        name: 'Thank you for participating',
        path: '/thank-you',
        component: () => require('../views/ThankYou.vue'),
        meta: {
            bgColor: "bg-blue-900"
        }
    },
    {
        name: 'Polling event report',
        path: '/polling-event/report/:id',
        component: () => require('../views/Report.vue')
    },
    {
        name: 'Poll result',
        path: '/poll/result/:id',
        component: () => require('../views/AdminPollResult.vue'),
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
        path: '/error',
        name: 'error',
        component: () => require('../views/Error.vue')
    }
]
