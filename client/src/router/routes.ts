import { RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: () => require('../views/Home.vue')
    },
    {
        path: '/test',
        name: 'Test',
        component: () => require('../views/Test.vue')
    },
    {
        path: '/create',
        name: 'Create a Polling event',
        component: () => require('../views/PollingEventCreate.vue'),
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
        path: '/create/:id',
        name: 'Add questions to a polling event',
        component:  () => require('../views/QuestionCreate.vue'),
    },
    {
        path: '/prototype',
        name: 'Prototype',
        component: () => require('../views/Prototype.vue'),
        children: [
            {
                name: 'Prototype Homepage',
                path: '',
                component: () => require('../views/P_Home.vue'),
                meta: {
                    needAdmin: true
                }
            },
            {
                name: 'Prototype create',
                path: '/create',
                component: () => require('../views/P_Create.vue'),
                meta: {
                    needAdmin: true
                }
            },
            {
                name: 'Prototype meeting',
                path: '/meeting-:id',
                component: () => require('../views/P_Vote.vue')
            },
            {
                name: 'Prototype admin',
                path: '/admin-:id',
                component: () => require('../views/P_AdministerVoting.vue'),
                meta: {
                    needAdmin: true
                }
            },
        ]
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
    },
]
