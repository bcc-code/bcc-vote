import Home from '../views/Home.vue'
import Test from '../views/Test.vue'
import Create from '../views/Create.vue'
import Vote from '../views/Vote.vue'
import Administer from '../views/AdministerVoting.vue'

export const routes = [{
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
    name: 'logout',
    path: "/logout",
    meta: {
      logout: true
    }
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
