import { createRouter, createWebHistory } from 'vue-router'
import { routes } from "./routes"

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

async function authentication() {
  const authenticationResult = await router.$client
    .reAuthenticate()
    .catch((err) => {
      if (err.message == "No accessToken found in storage" || err.message.includes('jwt')) {
        //Send unauthenticated/expired users to login endpoint
        location.href = "http://localhost:3030/oauth/auth0";
      } else {
        console.log(err);
      }
    })
  if (!authenticationResult) {
    return { authenticated: false }
  }
  // console.log(authenticationResult);
  const user = authenticationResult.user;

  // update the $user global variable
  router.$user.name = user.name;
  router.$user.age = user.age;
  router.$user.church = user.church;
  router.$user.churchID = user.churchID;
  router.$user.personID = user.personID;
  router.$user.roles = user.roles;
  router.$user.administrator = user.administrator;

  return { user, authenticated: true };
}

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
      var expires = ";expires=" + d
      var name = cookiename
      var value = ""
      document.cookie = name + "=" + value + expires + "; path=/acc/html"
    })
  }
  const url = `https://bcc-sso.eu.auth0.com/v2/logout?federated`
  location.href = url
}

async function authorization(user, to) {
  if (to.meta.needAdmin && !user.administrator) {
    location.href = '/';
    throw Error('You are unauthorized to get there');
  }
  return true;
}

router.beforeEach(async(to, from, next) => {
  if (to.meta.logout)
    logout();
  const { user, authenticated } = await authentication();
  if (authenticated) {
    const authorized = await authorization(user, to)
    if (authorized)
      next();
  }
})

router.afterEach(() => {
  let hash = window.location.hash
  if (hash.includes("access_token")) window.location.hash = ""
})

export default router
