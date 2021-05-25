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
    <meeting-tile v-for="(voting, ind) in votings" :key="ind" :data="voting" class="top-space-10"/>
    <meeting-tile v-for="(admin, ind) in administered" :key="ind" :data="admin" class="top-space-10"/>
  </div>
</template>

<script>
import MeetingTile from '../components/MeetingTile.vue';
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  components: { MeetingTile },
  name: 'Home',
  data () {
    return {
      votings: [],
      votingKeys: [],
      administered: [],
      time: 10000,
    }
  },
  created () {
    console.log(this.$user);
    const roleIds = this.$user.roles.map(r => r.id);
    this.$client.service('meetings').find({
      query: {
        $or: [
          {churchID: this.$user.churchID},
          {role: {$in: roleIds}}
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
      console.log(res);
      this.votings = res.data;
      const now = new Date().getTime();
      this.votings.forEach(v => {
        v.timeLeft = Math.floor((v.startTime - now) / 1000)
        v.admin = false;
        this.votingKeys.push(v._key);
      });
    })

    this.$client.service('meetings').find({
      query: {
        admin: this.$user.personID,
        $select: ['title', 'description', 'startTime', 'numberOfInvited']
      }
    }).then(res => {
      console.log(res);
      this.administered = res.data;
      console.log(this.administered);
      const now = new Date().getTime();
      this.administered.forEach(v => {
        v.timeLeft = Math.floor((v.startTime - now) / 1000)
        v.admin = true;
      });
      
    })
    setInterval(() => {
      this.votings.forEach(v => {
        v.timeLeft --;
      })
      this.administered.forEach(v => {
        v.timeLeft --;
      })
    }, 1000);
    this.$client.service('meetings').on('patched', this.updateMeeting);
  },
  methods: {
    log () {
      console.log(this.$user);
    },
    async makeRequest(){
      console.log('making request');
      // const res = await this.$client.service('members').find()
      // console.log(res);
      // this.$client.service('users').create(res);
      const res = await this.$client.service('users').find({
        query: {
          Developer: true,
        }
      });
      console.log(res);
    },
    updateMeeting(data) {
      const ind = this.votingKeys.indexOf(data._key);
      this.votings[ind].startTime = data.startTime;
      this.votings[ind].title = data.title;
      this.votings[ind].description = data.description;
      this.votings[ind].timeLeft = Math.floor((this.votings[ind].startTime - new Date().getTime()) / 1000)
    }
  }
}
</script>
