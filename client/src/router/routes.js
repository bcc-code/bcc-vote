import Home from '../views/Home.vue'
import Create from '../views/Create.vue'

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
]
