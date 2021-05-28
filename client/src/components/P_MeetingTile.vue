<template>
  <router-link :to="(data.admin ? '/admin-':'/meeting-')+data._key" class="width-80 color-grey rounded padding-vertical-10 horizontal center-line space-out clickable" :class="{ 'color-green': timeLeftStart < 0 && !data.admin, 'color-yellow': data.admin, 'color-red': ended }">
    <div>
      <h2>{{data.title}}</h2>
      <h3>{{data.numberOfInvited ? data.numberOfInvited : 0}} voters are invited</h3>
    </div>
    <h4 style="width: 20vw">{{data.description}}</h4>
    <h3> 
      <template v-if="!ended">
        <timer :time="timeLeftStart" ready="OPEN"/>
      </template>
      <template v-if="isEnd">
        <timer :time="timeLeftEnd" ready="CLOSED"/>
      </template>
    </h3>
  </router-link>
</template>

<script>
import Timer from './P_Timer.vue'
export default {
    components: {
        Timer,
    },
    props: {
        data: Object,
    },
    data () {
        return {
            timeLeftStart: 100,
            timeLeftEnd: 100,
            isStart: false,
            isEnd: false,
            ended: false,
        }
    },
    created (){
        console.log(this.data)
        const now = new Date().getTime()
        if(this.data.startTime){
            this.isStart = true
            this.timeLeftStart = this.data.startTime - now
            this.timeLeftStart = Math.floor(this.timeLeftStart/1000)
        }
        if(this.data.endTime){
            this.isEnd = true
            this.timeLeftEnd = this.data.endTime - now
            this.timeLeftEnd = Math.floor(this.timeLeftEnd/1000)
            if(this.timeLeftEnd < 0)
                this.ended = true
        }
        const interval = setInterval(() => {
            if(this.isEnd){
                this.timeLeftEnd--
                if(this.timeLeftEnd < 0){
                    this.ended = true
                }
            }
            if(this.isStart){
                this.timeLeftStart--
                if(this.timeLeftStart < 0){
                    this.isStart = false
                }
            }
            if(!this.isStart && !this.isEnd)
                clearInterval(interval)
        }, 1000)
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
