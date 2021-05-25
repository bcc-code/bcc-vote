<template>
  <div class="width-80 color-grey rounded padding-vertical-10 horizontal center-line space-out">
    <div>
      <h2>{{title}}</h2>
      <h3>{{votersNum ? votersNum : 0}} voters are invited</h3>
    </div>
    <h4 style="width: 20vw">{{description}}</h4>
    <h3> 
      {{timeLeft > 0 ? formattedTime: "OPEN"}}
    </h3>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    description: String,
    timeLeft: Number,
    votersNum: Number
  },
  computed: {
    formattedTime () {
      let hours   = Math.floor(this.timeLeft / 3600);
      let minutes = Math.floor((this.timeLeft - (hours * 3600)) / 60);
      let seconds = this.timeLeft - (hours * 3600) - (minutes * 60);

      if (hours   < 10) {hours   = "0"+hours}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}

      return hours+":"+minutes+":"+seconds;
    }
  }
}
</script>