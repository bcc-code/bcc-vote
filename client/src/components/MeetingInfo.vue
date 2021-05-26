<template>
  <div>
    <h2>{{info.title}}</h2>
    <h3>{{info.description}}</h3>
    <div class="horizontal center-line">
      <h3 v-if="this.timeLeftStart > 0">Starts in &nbsp;</h3>
      <h3><timer :time="this.timeLeftStart" ready="Started"/></h3>
    </div>
    <div v-if="isEnd" class="horizontal center-line">
      <h3 v-if="this.timeLeftEnd > 0">Ends in &nbsp;</h3>
      <h3><timer :time="this.timeLeftEnd" ready="Closed"/></h3>
    </div>
  </div>
</template>

<script>
import Timer from "./Timer"

export default {
    components: {
        Timer,
    },
    props: {
        info: Object,
    },
    data () {
        return {
            timeLeftStart: 100,
            timeLeftEnd: 100,
            isEnd: false,
        }
    },
    created(){
        this.startTimer()
    },
    methods: {
        startTimer() {
            const now = new Date().getTime()
            this.timeLeftStart = this.info.startTime - now
            this.timeLeftStart = Math.floor(this.timeLeftStart / 1000)
            if(this.info.timeLeftEnd){
                this.isEnd = true
                this.timeLeftEnd = this.info.endTime - now
                this.timeLeftEnd = Math.floor(this.timeLeftEnd / 1000)
            }
            setInterval(() => {
                this.timeLeftStart --
                if(this.timeLeftEnd)
                    this.timeLeftEnd --
            }, 1000)
        }
    }
}
</script>
