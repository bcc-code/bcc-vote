import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

const router: any = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})


async function authentication() {
    const authenticationResult = await router.$client
        .reAuthenticate()
        .catch((err: any) => {
            if (err.message === "No accessToken found in storage" || err.message.includes('jwt')) {
                location.href = window.location.hostname == 'localhost' ? 'http://localhost:4040/oauth/auth0' : `${location.origin}/oauth/auth0/`                
            }
        })
    if (!authenticationResult) {
        return { authenticated: false }
    }
    const user = authenticationResult.user

    router.$user.age = user.age
    router.$user.churchID = user.churchID
    router.$user.personID = user.personID
    if(user.roles){
        router.$user.authorityLevel = user.roles[0].securityLevel
        router.$user.roles = user.roles
    }
    else{
        router.$user.roles = user.role
        router.$user.authorityLevel = 10;
    }
    

    return { user, authenticated: true }
}

function authorization(user: any, to: any) {
    if (to.meta.needAdmin && !user.administrator) {
      location.href = '/';
      throw Error('You are unauthorized to get there');
    }
    return true;
  }
  

router.beforeEach(async(to: any, from: any, next: any) => {
    const { user, authenticated } = await authentication()
    if (authenticated) {
        const authorized = authorization(user, to)
        if (authorized)
            next();
    }
})

router.afterEach(() => {
    const hash = window.location.hash
    if (hash.includes("access_token")) window.location.hash = ""
})

export default router
