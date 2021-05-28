import { RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Prototype from '../views/Prototype.vue'
import PrototypeHome from '../views/P_Home.vue'
import Create from '../views/P_Create.vue'
import Vote from '../views/P_Vote.vue'
import Administer from '../views/P_AdministerVoting.vue'
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
                component: Create,
                meta: {
                    needAdmin: true
                }
            },
            {
                name: 'Prototype meeting',
                path: '/meeting-:id',
                component: Vote
            },
            {
                name: 'Prototype admin',
                path: '/admin-:id',
                component: Administer,
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
