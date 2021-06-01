import { RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: () => require('../views/Home.vue')
    },
    {
        path: '/create',
        name: 'Create a Polling event',
        component: () => require('../views/PollingEventCreate.vue')
    },
    {
        name: 'Prepare the Polling event',
        path: '/polling-event/prepare/:id',
        component: () => require('../views/AdminEventPrepare.vue')
    },
    {
        name: 'Administrate the Live polling event',
        path: '/polling-event/live/:id',
        component: () => require('../views/AdminEventLive.vue'),
        meta: {
            bgColor: "bg-blue-900"
        }
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
