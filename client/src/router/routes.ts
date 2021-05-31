import { RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import PollingEventCreate from '../views/PollingEventCreate.vue'
import PollingEventPrepare from '../views/AdminEventPrepare.vue'
import PollingEventLive from '../views/AdminEventLive.vue'
import QuestionCreate from '../views/QuestionCreate.vue'
import Prototype from '../views/Prototype.vue'
import PrototypeHome from '../views/P_Home.vue'
import PrototypeCreate from '../views/P_Create.vue'
import PrototypeVote from '../views/P_Vote.vue'
import PrototypeAdminister from '../views/P_AdministerVoting.vue'
import Test from '../views/Test.vue'

export const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/test',
        name: 'Test',
        component: Test
    },
    {
        path: '/create',
        name: 'Create a Polling event',
        component: PollingEventCreate,
    },
    {
        name: 'Prepare the Polling event',
        path: '/polling-event:id/prepare',
        component: PollingEventPrepare
    },
    {
        name: 'Administrate the Live polling event',
        path: '/polling-event:id/live-polling',
        component: PollingEventLive
    },
    {
        path: '/create/:id',
        name: 'Add questions to a polling event',
        component:  QuestionCreate,
    },
    {
        path: '/prototype',
        name: 'Prototype',
        component: Prototype,
        children: [
            {
                name: 'Prototype Homepage',
                path: '',
                component: PrototypeHome,
                meta: {
                    needAdmin: true
                }
            },
            {
                name: 'Prototype create',
                path: '/create',
                component: PrototypeCreate,
                meta: {
                    needAdmin: true
                }
            },
            {
                name: 'Prototype meeting',
                path: '/meeting-:id',
                component: PrototypeVote
            },
            {
                name: 'Prototype admin',
                path: '/admin-:id',
                component: PrototypeAdminister,
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
    }
]
