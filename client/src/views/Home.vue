<template>
  <div>
        <div class="flex justify-center items-center w-full background-home h-64 sm:h-128">
            <div class="max-w-md text-center text-blue-900 pt-12 sm:pt-32">
                <h1 class="font-bold pb-5">{{$t('titles.home')}}</h1>
                <p class="hidden sm:block">
                    {{$t('descriptions.home')}}
                </p>
                <router-link v-if="$user.administrator" to="/create">
                    <GradButton class="text-2xl sm:text-base sm:mt-4">
                        {{$t('actions.create-meeting')}}
                    </GradButton>
                </router-link>
            </div>
        </div>
        <div class="flex py-4 gap-6 text-gray-700  font-bold justify-center cursor-pointer">
            <h3 :class="{'text-blue-900': currentTab==='events'}" @click="currentTab='events'">{{$t('actions.show-events')}}</h3>
            <h3 :class="{'text-blue-900': currentTab==='history'}" @click="currentTab='history'">{{$t('actions.show-history')}}</h3>
        </div>
        <Info class="m-4">
            {{$t('info.no-meetings')}}
        </Info>
  </div>
</template>

<script>
import GradButton from '../components/GradButton'
import Info from '../components/Info'

export default {
    components: {
        GradButton,
        Info,
    },
    props: {
        mobile: Boolean,
    },
    data () {
        return {
            currentTab: 'events',
            meetings: [],
        }
    },
    mounted(){
        this.loadMeetings();
    },
    methods: {
        loadMeetings(){
            const roleIds = this.$user.roles.map(r => r.id)
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
                console.log(this.meetings);
            })
        }
    }
}
</script>

<style scoped>

</style>
