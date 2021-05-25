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
    name: 'vote',
    path: '/vote-:id',
    component: Vote
  },
  {
    name: 'administer',
    path: '/administer-:id',
    component: Administer,
    meta: {
      needAdmin: true
    }
  },
]
