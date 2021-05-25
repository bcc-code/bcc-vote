<template>
  <div id="container" class="container vertical">
    <router-link class="width-80" to="/create">
    <input type="submit" class="width-80" v-if="$user.administrator" value="create a meeting"/>
    </router-link>
    <img alt="Vue logo" src="../assets/logo.png">
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

    this.loadMeetingsMember();
    this.loadMeetingsAdmin();
  },
  methods: {
    log () {
      console.log(this.$user);
    },
    loadMeetingsMember(){
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
        $select: ['title', 'description', 'startTime', 'endTime', 'numberOfInvited']
      }
    }).then(res => {
      this.votings = res.data;
      this.votings.forEach(v => {
        v.admin = false;
      });
    })
    },
    loadMeetingsAdmin(){
      this.$client.service('meetings').find({
        query: {
          admin: this.$user.personID,
          $select: ['title', 'description', 'startTime',  'endTime', 'numberOfInvited']
        }
      }).then(res => {
        this.administered = res.data;
        this.administered.forEach(v => {
          v.admin = true;
        });
      })
    }
  }
}
</script>
