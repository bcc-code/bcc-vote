<template>
  <div id="container" class="container vertical">
    <router-link class="width-80" to="/create">
    <input type="submit" class="width-80" v-if="$user.administrator" value="create a meeting"/>
    </router-link>
    <img alt="Vue logo" src="../assets/logo.png">
    <!-- <div v-for="(voting, ind) in votings" :key="ind">
      {{voting.title}} {{voting.description}} 
      <div> {{voting.startTime}}</div>
    </div> -->
    <meeting-tile v-for="(voting, ind) in votings" :key="ind" :title="voting.title" :description="voting.description" :timeLeft="voting.timeLeft" :votersNum="numberOfInvited"/>
  </div>
</template>

<script>
import MeetingTile from '../components/MeetingTile.vue';
export default {
  components: { MeetingTile },
  name: 'Home',
  data () {
    return {
      votings: [],
      administer: [],
      time: 10000,
    }
  },
  mounted () {
    this.$client.service('meetings').find({
      query: {
        $or: [
          {churchID: this.$user.churchID},
          {role: {$in: this.$user.roles}}
        ],
        minAge: {
          $lt: this.$user.age
        },
        maxAge: {
          $gt: this.$user.age
        },
        $select: ['title', 'description', 'startTime', 'numberOfInvited']
      }
    }).then(res => {
      this.votings = res.data;
      const now = new Date().getTime();
      this.votings.forEach(v => {
        v.timeLeft = Math.floor((v.startTime - now) / 1000)
      });
    })
    setInterval(() => {
      this.votings.forEach(v => {
        v.timeLeft --;
      })
    }, 1000);
  }
}
</script>
