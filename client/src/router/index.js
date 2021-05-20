import { createRouter, createWebHistory } from 'vue-router'
import { routes } from "./routes"

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

async function authentication() {
  console.log(router.app);
  const authenticationResult = await router.$client
    .reAuthenticate()
    .catch((err) => {
      //Send unauthenticated/expired users to login endpoint
      location.href = "http://localhost:3030/oauth/auth0";
      console.log(err);
    })
  if (!authenticationResult) {
    return { authenticated: false }
  }
  console.log(authenticationResult);
  const user = authenticationResult.user;

  // update the $user global variable
  router.$user.name = user.name;
  router.$user.churchName = user.churchName;
  router.$user.personID = user.personID;

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

router.beforeEach(async(to, from, next) => {
  if (to.meta.logout)
    logout();
  const { authenticated } = await authentication();
  if (authenticated)
    next();
})

router.afterEach(() => {
  let hash = window.location.hash
  if (hash.includes("access_token")) window.location.hash = ""
})

export default router
