import { createApp } from 'vue'

import DKToast from 'vue-dk-toast'
import Spinner from "@/components/spinner.vue"

import './assets/style.css'
import store from './store'
import App from './App.vue'

import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import auth from '@feathersjs/authentication-client'
import io from 'socket.io-client'
import router from './router'

const app = createApp(App)

app.component('Spinner', Spinner)
app.use(DKToast,{duration:5000, positionX: 'right',positionY:'bottom'})
app.use(router)
app.use(store)

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

router.$client = client
router.$user = user
app.config.globalProperties.$client = client
app.config.globalProperties.$user = user

app.mount("#app")