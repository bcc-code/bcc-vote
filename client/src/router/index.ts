import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

const router: any = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

function logout() {
    router.$client.logout()
    localStorage.clear()
    sessionStorage.clear()
    var cookies = document.cookie.split(";")
    for (var i = 0; i < cookies.length; i++) {   
        var spcook = cookies[i].split("=")
        spcook.forEach((cookiename) => {
            var d = new Date()
            d.setDate(d.getDate() - 1)
            var expires = ";expires="+d
            var name=cookiename
            var value=""
            document.cookie = name + "=" + value + expires + "; path=/acc/html"  
        })
    }
    const url = `https://bcc-sso.eu.auth0.com/v2/logout?client_id=e9qdZ4dhMhhG9YbDPmo9hzI7Sp644ulH&returnTo=${location.origin}&federated`
    location.href = url               
}

router.beforeEach(async(to: any, from: any, next: Function) => {
    if(to.meta.unprotected){
        next()
    } else if(to.meta.logout){
        logout()
    } else {
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
            } else {
                next({ name: "error", params: { message: error.message}})
            }
        }
    }
})

router.afterEach(() => {
    const hash = window.location.hash
    if (hash.includes("access_token")) window.location.hash = ""
})

export default router
