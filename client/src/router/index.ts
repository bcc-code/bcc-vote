import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

const router: any = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})


async function authentication() {
    try {
        const { user } = await router.$client.reAuthenticate()
        
        router.$user._key = user._key
        router.$user.name = user.name
        router.$user.age = user.age        
        router.$user.churchID = user.churchID
        router.$user.personID = user.personID
        router.$user.roles = user.roles
       
        console.log(router.$user)

        return { user, authenticated: true }

    } catch(err: any) {
        if(err.message === "No accessToken found in storage" || err.message.includes('jwt')) {
            location.href = window.location.hostname == 'localhost' ? 'http://localhost:4040/oauth/auth0' : `${location.origin}/oauth/auth0/`
            return { authenticated: false }        
        } else {
            console.log('Routing Error:',err)
            return { authenticated: false, error: err }
        }
    }
}


  

router.beforeEach(async(to: any, from: any, next: any) => {
    const { user, authenticated, error } = await authentication()
    if(authenticated) {        
        next();
    } else if(error) {
        next({ name: "error" })
    }
})

router.afterEach(() => {
    const hash = window.location.hash
    if (hash.includes("access_token")) window.location.hash = ""
})

export default router
