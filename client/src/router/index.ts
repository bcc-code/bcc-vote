import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

const router: any = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})


async function authentication() {
    try {
        const { user } = await router.$client.reAuthenticate()

        router.$user._id = user._id
        router.$user._key = user._key
        router.$user.name = user.name
        router.$user.age = user.age
        router.$user.church = user.church
        router.$user.churchID = user.churchID
        router.$user.personID = user.personID
        router.$user.administrator = user.administrator
        if(user.roles){
            router.$user.authorityLevel = user.roles[0].securityLevel
            router.$user.roles = user.roles
        }
        else{
            router.$user.roles = user.role
            router.$user.authorityLevel = 10;
        }
    

        return { user, authenticated: true }

    } catch(err: any) {
        if(err.message === "No accessToken found in storage" || err.message.includes('jwt')) {
            location.href = window.location.hostname == 'localhost' ? 'http://localhost:4040/oauth/auth0' : `${location.origin}/oauth/auth0/`
            return { authenticated: false }        
        } else {
            return { authenticated: false, error: err }
        }
    }
}

function authorization(user: any, to: any) {
    if (to.meta.needAdmin && !user.administrator) {
      location.href = '/';
      throw Error('You are unauthorized to get there');
    }
    return true;
  }
  

router.beforeEach(async(to: any, from: any, next: any) => {
    const { user, authenticated, error } = await authentication()
    if(authenticated) {
        const authorized = authorization(user, to)
        if (authorized)
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
