<template>
  <div class = "top-space-10 padding-vertical-10">
    <div class="horizontal center-line space-out">
      <h3>{{data.text}}</h3>
      <h3 v-if="data.isTime"><timer :time="timeLeft" /></h3>
    </div>
    <h3>Answers {{data.public ? 'are': 'aren\'t'}} publicly available</h3>
  </div>
</template>

<script>

import Timer from "./Timer.vue"

export default {
  components: { 
    Timer
  },
  props: {
    data: Object,
  },
  data () {
    return {
      timeLeft: 100,
    }
  },
  created(){
    if(this.data.isTime){
      const now = new Date().getTime();
      this.timeLeft = this.data.timeLimit - now;
      this.timeLeft = Math.floor(this.timeLeft / 1000);
      if(this.timeLeft >= 0)
        this.startTimer();
    }
  },
  methods: {
    startTimer() {
      const interval = setInterval(() => {
        this.timeLeft --;
        if(this.timeLeft < 0){
          console.log('emit timeout')
          clearInterval(interval);
          this.$emit('timeOut')
        }
      }, 1000);
    }
  },
  emits: ['timeOut'],
}
</script>