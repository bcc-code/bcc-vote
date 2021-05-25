import Home from '../views/Home.vue'
import Create from '../views/Create.vue'
import Vote from '../views/Vote.vue'
import Administer from '../views/AdministerVoting.vue'

export const routes = [{
    path: '/',
    name: 'Home',
    component: Home
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
