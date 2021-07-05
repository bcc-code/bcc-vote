import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { logToSentry } from '../functions/helpers'

const router: any = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach(async(to: any, from: any, next: Function) => {
    if(router.$gtag)
        router.$gtag.event('page_view', {'page_title': to.name})
    if(to.meta.unprotected){
        next()
    }else {
        try {
            const { user } = await router.$client.reAuthenticate()
            router.$user._key = user._key
            router.$user._id = user._id
            router.$user.displayName = user.displayName
            router.$user.age = user.age
            router.$user.churchID = user.churchID
            router.$user.personID = user.personID
            router.$user.roles = user.roles
            router.$user.activeRole = user.activeRole
            next()
        } catch(error) {
            const authEndpoint = window.location.hostname === 'localhost' ? 'http://localhost:4040/oauth/auth0' : `${location.origin}/oauth/auth0/`
            const requiresAuth = error.message === "No accessToken found in storage" || error.message.includes('jwt')
            if(requiresAuth) {
                location.href = authEndpoint
                next(false)
            } else {
                logToSentry(error)
                next({ path: "/error-"+error.message})
            }
        }
    }
})

router.afterEach(() => {
    const hash = window.location.hash
    if (hash.includes("access_token")) window.location.hash = ""
})

export default router
