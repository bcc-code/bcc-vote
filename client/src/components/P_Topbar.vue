<template>
  <div id="top-bar" class="horizontal space-out">
    <router-link to="/prototype">
      <div class="clickable topEl">Home</div>
    </router-link>
      
    <div id="logging" class="horizontal">
        <router-link to="/logout" class="clickable topEl">Log out</router-link>
    </div>
  </div>
</template>
<script>
export default {
    name: 'Topbar',
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
</style>
