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
import vueGtag from 'vue-gtag'

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

if(window.location.hostname === 'vote.bcc.no'){
    app.use(vueGtag, {
        config: {id: 'G-6V21WXD03F'}
    })
}

// to test the analytics locally uncomment code below
// app.use(vueGtag, {
//     config: {id: 'G-4KNVYNZ55W'}
// })

app.mixin({
    methods: {
        $showError(error: Error) {
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

router.$client = client
store.$client = client
router.$user = user
router.$gtag = app.config.globalProperties.$gtag;
app.config.globalProperties.$client = client
app.config.globalProperties.$user = user

if(app.config.globalProperties.$gtag){
    client.hooks({
        before: {
            all: [(context:any) => {
                app.config.globalProperties.$gtag.event(context.method+' '+context.path)
            }]
        }
    })
}

document.title = 'BCC Vote'
app.mount("#app")
