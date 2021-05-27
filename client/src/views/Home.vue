<template>
  <div style="height: 500px">
  </div>
</template>

<script>
export default {
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
