import { createApp } from 'vue'

import './assets/style.css'
import store from './store'
import App from './App.vue'

import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import auth from '@feathersjs/authentication-client'
import io from 'socket.io-client'
import router from './router'

const socket = io('http://localhost:3030')
const client = feathers()

client.configure(socketio(socket))

client.configure(auth())

const user = {
    name: null,
    church: null,
    age: null,
    personID: null,
    administrator: null,
    roles: null,
}

const app = createApp(App)
app.use(router)
app.use(store)
router.$client = client
router.$user = user
app.config.globalProperties.$client = client
app.config.globalProperties.$user = user

app.mount("#app")
