import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Create from '../views/Create.vue'

export const routes = [{
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: About
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
  }
]
