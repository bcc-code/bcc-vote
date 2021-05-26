import { RouteRecordRaw } from 'vue-router'

import Home from '../views/Home.vue'
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
]
