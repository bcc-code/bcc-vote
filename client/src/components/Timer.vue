<template>
  <div>{{time > 0 ? formattedTime: ready}}</div>
</template>
<script>
export default {
  props: {
    time: Number,
    ready: String,
  },
  computed: {
    formattedTime () {
      let hours   = Math.floor(this.time / 3600);
      let minutes = Math.floor((this.time - (hours * 3600)) / 60);
      let seconds = this.time - (hours * 3600) - (minutes * 60);

      if (hours   < 10) {hours   = "0"+hours}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}

      return hours+":"+minutes+":"+seconds;
    }
  }
}
</script>