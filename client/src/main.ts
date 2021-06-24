import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import Toast from 'vue-dk-toast'
import Spinner from "@/components/spinner.vue"
import InfoBox from '@/components/info-box.vue'
import './assets/style.css'
import App from './App.vue'
import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import auth from '@feathersjs/authentication-client'
import io from 'socket.io-client'
import { Role } from './domain/User'
import { store } from './store'
import router from './router'
<<<<<<< Updated upstream
=======
import vueGtag from 'vue-gtag'
import { captureException, init, setTag } from '@sentry/browser';
>>>>>>> Stashed changes

const messages = {    
    no: Object.assign({}, require('./localization/no_vote_master.json'))
};

const i18n = createI18n({
    locale: 'no',
    fallbackLocale: 'no',
    messages
})

const app = createApp(App)

app.component('Spinner', Spinner)
app.component('InfoBox', InfoBox)
app.use(Toast,{duration:2000, positionX: 'right',positionY:'bottom'})
app.use(i18n)
app.use(router)
app.use(store)

app.mixin({
    methods: {
        $showError(error: Error) {
            const personID = app.config.globalProperties.$user?.personID
            if(personID)
                setTag('personID', personID)
            captureException(error)
            const settings = {
                class: 'error'
            } as any
            if(window.innerWidth < 640){
                settings.positionY = 'top'
            }
            this.$toast(error, settings)

        }
    },
    computed: {
        $canAdministratePollingEvents():boolean {
            if(this.$user.roles) {
                const allowedRoles = ['Developer','SentralInformasjonsmedarbeider','CentralAdministrator','VotingAdmin']
                const allowedUserRoles = this.$user.roles.filter((r:Role) => allowedRoles.includes(r.enumName))
                if(allowedUserRoles.length) {
                    return true
                }
            }
            return false
        }
    }
})

const client = feathers()
const socket = io(window.location.hostname === 'localhost' ? 'http://localhost:4040' : `${location.origin}`,{
    transports:["websocket", "polling"]
})

client.configure(socketio(socket))
client.configure(auth())

const user = {
    age: null,
    churchID: null,
    personID: null,
    roles: null,
    activeRole: ''
}

app.config.errorHandler = (error, _, info) => {
    setTag('info', info);
    captureException(error);
};

init({dsn: 'https://dbf27d5d8fb240fca38d556b88643510@o878549.ingest.sentry.io/5830437'})

router.$client = client
store.$client = client
router.$user = user
app.config.globalProperties.$client = client
app.config.globalProperties.$user = user

document.title = 'BCC Vote'
app.mount("#app")
