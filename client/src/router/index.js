import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Messages from '../views/Messages.vue'
import CreateVoting from '../views/CreateVoting.vue'
import MyVotings from '../views/Votings.vue'
import VotingTemplates from '../views/VotingTemplates.vue'
import EditTemplate from '../views/EditTemplate.vue'
import InitializeVoting from '../views/InitializeVoting.vue'
import AdministerVoting from '../views/AdministerVoting.vue'
import Vote from '../views/Vote.vue'

const routes = [{
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/messages',
    name: 'Messages',
    component: Messages
  },
  {
    path: '/templates',
    name: 'Voting Templates',
    component: VotingTemplates
  },
  {
    path: '/templates/create',
    name: 'Create Voting',
    component: CreateVoting
  },
  {
    path: '/templates/edit-:id',
    name: 'Edit Template',
    component: EditTemplate
  },
  {
    path: '/votings',
    name: 'Votings',
    component: MyVotings
  },
  {
    path: '/votings/initialize-:id',
    name: 'Initialize Voting',
    component: InitializeVoting
  },
  {
    path: '/votings/administer-:id',
    name: 'Administer Voting',
    component: AdministerVoting,
  },
  {
    path: '/votings/vote-:id',
    name: 'Vote',
    component: Vote,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
