<template>
  <div id="container" class="container vertical">
    <router-link class="width-80" to="/create">
    <input type="submit" class="width-80" v-if="$user.administrator" value="create a meeting"/>
    </router-link>
    <img alt="Vue logo" src="../assets/logo.png">
    <meeting-tile v-for="(meeting, ind) in meetings" :key="ind" :data="meeting" class="top-space-10"/>
    <meeting-tile v-for="(admin, ind) in administered" :key="ind" :data="admin" class="top-space-10"/>
  </div>
</template>

<script>
import MeetingTile from '../components/MeetingTile.vue'
export default {
    components: { MeetingTile },
    name: 'Home',
    data () {
        return {
            meetings: [],
            administered: [],
            time: 10000,
        }
    },
    created () {
        this.loadMeetingsMember()
        this.loadMeetingsAdmin()        
    },
    methods: {
        log () {
            console.log(this.$user)
        },
        loadMeetingsMember(){
            const roleIds = this.$user.roles.map(r => r.id)
            console.log(roleIds)
            this.$client.service('meetings').find({
                query: {
                    $or: [
                        {role: {$in: roleIds}},
                        {churchID: this.$user.churchID},
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
                this.meetings = res.data
                this.meetings.forEach(v => {
                    v.admin = false
                })
            })
        },
        loadMeetingsAdmin(){
            this.$client.service('meetings').find({
                query: {
                    admin: this.$user.personID,
                    $select: ['title', 'description', 'startTime',  'endTime', 'numberOfInvited']
                }
            }).then(res => {
                this.administered = res.data
                this.administered.forEach(v => {
                    v.admin = true
                })
            })
        }       
    }
}
</script>
