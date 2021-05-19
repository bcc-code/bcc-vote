<template>
  <div id="top-bar" class="horizontal space-out">
    <div id="nav" class="horizontal">
      <router-link to="/">
        <div class="button topEl">Home</div>
      </router-link>
      <!-- <router-link to="/messages">
        <div class="button topEl">Messages</div>
      </router-link> -->
      <router-link v-if="me._id" to="/templates">
        <div class="button topEl">Voting templates</div>
      </router-link>
      <router-link v-if="me._id" to="/votings">
        <div class="button topEl">My votings</div>
      </router-link>
      
    </div>
    <div id="logging" class="horizontal">
      <template v-if="me.name">
        <div class="topEl name">{{me.name}}</div>
        <router-link to="/">
          <div @click="$emit('logout')" class="button topEl">Log out</div>
        </router-link>
      </template>
      <router-link v-else to="/login">
        <div class="button topEl">Log in</div>
      </router-link>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Topbar',
  props: {
    me: Object
  },
}
</script>

<style scoped>
  a {
    text-decoration: none;
  }
  #top-bar{
    width: calc(100% - 60px);
    height: 60px;
    background-color: #333;
    padding: 0 30px;
  }
  
  .topEl {
    height: 20px;
    background-color: rgb(202, 98, 0);
    color: white;
    margin: 10px;
    padding: 10px 20px;
    text-decoration: none;
    border-radius: 20px;
  }
  a .topEl:hover{
    background-color: rgb(136, 66, 1);
  }
  
  .name {
    background-color: rgb(202, 64, 0);

  }
  .button:hover {
      cursor: pointer;
  }
</style>