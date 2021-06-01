import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import Toast from 'vue-dk-toast'
import Spinner from "@/components/spinner.vue"
import InfoBox from '@/components/info-box.vue'
import './assets/style.css'
import store from './store'
import App from './App.vue'
import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import auth from '@feathersjs/authentication-client'
import io from 'socket.io-client'
import router from './router'

const messages = {
    master: Object.assign({}, require('./localization/master.json')),
    no: Object.assign({}, require('./localization/no_master.json'))
}

const i18n = createI18n({
    locale: 'no',
    fallbackLocale: 'master',
    messages
})

const app = createApp(App)

app.component('Spinner', Spinner)
app.component('InfoBox', InfoBox)
app.use(Toast,{duration:5000, positionX: 'right',positionY:'bottom'})
app.use(i18n)
app.use(router)
app.use(store)

const client = feathers()
const socket = io(window.location.hostname == 'localhost' ? 'http://localhost:4040' : `${location.origin}`)

client.configure(socketio(socket))
client.configure(auth())

const user = {
    age: null,
    churchID: null,
    personID: null,
    authorityLevel: null,
    roles: null,
}

router.$client = client
router.$user = user
app.config.globalProperties.$client = client
app.config.globalProperties.$user = user

app.mount("#app")