<template>
  <div>
    <div class="flex justify-center items-center w-full background-home h-64 sm:h-128">
        <div class="max-w-md text-center text-blue-900 pt-12 sm:pt-32">
            <h1 class="font-bold pb-5">{{$t('titles.home')}}</h1>
            <p class="hidden sm:block">
                {{$t('descriptions.home')}}
            </p>
            <router-link v-if="$user.authorityLevel <= 5" to="/create">
                <button class="gradient-button lg-button text-2xl sm:text-base sm:mt-4">
                    {{$t('actions.create-meeting')}}
                </button>
            </router-link>
        </div>
    </div>
    <div class="flex py-4 gap-6 text-gray-700  font-bold justify-center cursor-pointer">
        <h3 :class="{'text-blue-900': currentTab==='events'}" @click="currentTab='events'">{{$t('labels.voting-events')}}</h3>
        <h3 :class="{'text-blue-900': currentTab==='history'}" @click="currentTab='history'">{{$t('labels.history')}}</h3>
    </div>
    <InfoBox class="m-4">
        {{$t('info.no-meetings')}}
    </InfoBox>
    <PollingEventCard />
  </div>
</template>

<script>
import InfoBox from '../components/info-box'
import PollingEventCard from '../components/polling-event-card'

export default {
    components: {
        InfoBox,
        PollingEventCard
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
            })
        }
    }
}
</script>

<style scoped>

</style>
