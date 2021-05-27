import { RouteRecordRaw } from 'vue-router'

import Home from '../views/Home.vue'
import Create from '../views/Create.vue'
import Vote from '../views/Vote.vue'
import Administer from '../views/AdministerVoting.vue'
import Test from '../views/Test.vue'



export const routes: Array<RouteRecordRaw> = [{
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
    name: 'create',
    path: '/create',
    component: Create,
    meta: {
        needAdmin: true
    }
},
{
    name: 'meeting',
    path: '/meeting-:id',
    component: Vote
},
{
    name: 'admin',
    path: '/admin-:id',
    component: Administer,
    meta: {
        needAdmin: true
    }
},
]
