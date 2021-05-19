import { createRouter, createWebHistory } from 'vue-router'
import { routes } from "./routes"

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

async function authentication() {
  console.log(router.app);
  // console.log(app);
  // const client = app.appContext.config.globalProperties.$client;
  // console.log(client);
  // const authenticationResult = await app.$client
  //   .reAuthenticate()
  //   .catch((err) => {
  //     //Send unauthenticated/expired users to login endpoint
  //     location.href = "localhost:3030/oauth/auth0";
  //     console.log(err);
  //   })
  // if (!authenticationResult) {
  //   return { authenticated: false }
  // }

  // const user = authenticationResult.user;
  // // app.$d.user = user;

  // console.log(user);

  // return { user, authenticated: true };
}

router.beforeEach(async(to, from, next) => {
  const { authenticated } = await authentication(to, from, next);
  if (authenticated)
    next();
})

router.afterEach(() => {
  let hash = window.location.hash
  if (hash.includes("access_token")) window.location.hash = ""
})

export default router
