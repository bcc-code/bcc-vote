<template>
  <router-link :to="(data.admin ? '/admin-':'/meeting-')+data._key" class="width-80 color-grey rounded padding-vertical-10 horizontal center-line space-out clickable" :class="{ 'color-green': data.timeLeft < 0 && !data.admin, 'color-yellow': data.admin }">
    <div>
      <h2>{{data.title}}</h2>
      <h3>{{data.votersNum ? data.votersNum : 0}} voters are invited</h3>
    </div>
    <h4 style="width: 20vw">{{data.description}}</h4>
    <h3> 
      <timer :time="data.timeLeft" ready="OPEN"/>
    </h3>
  </router-link>
</template>

<script>
import Timer from './Timer.vue';
export default {
  components: {
    Timer,
  },
  props: {
    data: Object,
  },
  computed: {
    formattedTime () {
      let hours   = Math.floor(this.data.timeLeft / 3600);
      let minutes = Math.floor((this.data.timeLeft - (hours * 3600)) / 60);
      let seconds = this.data.timeLeft - (hours * 3600) - (minutes * 60);

      if (hours   < 10) {hours   = "0"+hours}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}

      return hours+":"+minutes+":"+seconds;
    }
  }
}
</script>

<style scoped>
  a {
    color: #2c3e50;
    text-decoration: none;
  }
  .open{
    background-color: green;
  }
  .admin{
    background-color: rgb(255, 187, 0);
  }
</style>