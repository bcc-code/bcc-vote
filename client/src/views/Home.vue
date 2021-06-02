<template>
  <div>
    <div class="flex justify-center items-center w-full background-home h-64 sm:h-128">
        <div class="max-w-md text-center text-blue-900 pt-12 sm:pt-32">
            <h1 class="font-bold pb-5">{{$t('titles.home')}}</h1>
            <p class="hidden sm:block">
                {{$t('descriptions.home')}}
            </p>
            <router-link to="/create">
                <button class="gradient-button lg-button text-2xl sm:text-base sm:mt-4">
                    {{$t('actions.create-meeting')}}
                </button>
            </router-link>
        </div>
    </div>
    <div class="max-w-5xl mx-auto">
        <div class="flex py-8 gap-6 text-gray-700  font-bold justify-center cursor-pointer">
            <h3 :class="{'text-blue-900': currentTab==='events'}" @click="currentTab='events'">{{$t('labels.voting-events')}}</h3>
            <h3 :class="{'text-blue-900': currentTab==='history'}" @click="currentTab='history'">{{$t('labels.history')}}</h3>
        </div>
        <div v-if="currentTab == 'events'">
            <div v-if="pollingEvents.length">
                <div v-for="pollingEvent in pollingEvents" :key="pollingEvent._id">
                    <PollingEventCard class="mb-8" :pollingEvent="pollingEvent"/>
                </div>
            </div>
            <InfoBox v-else class="mb-4">
                {{$t('info.no-meetings')}}
            </InfoBox>
        </div>
    </div>
  </div>
</template>
<script lang="ts">
import InfoBox from '../components/info-box.vue'
import PollingEventCard from '../components/polling-event-card.vue'
import { defineComponent } from 'vue'
export default defineComponent({
    components: {
        InfoBox,
        PollingEventCard
    },
    props: {
        mobile: Boolean,
    },
    data () {
        return {
            currentTab: 'events' as string,
            pollingEvents: [],
        }
    },
    async mounted(){
        await this.loadMeetings();
    },
    methods: {
        async loadMeetings(){
            const roleIds = this.$user.roles.map((r:any) => r.id)
            this.pollingEvents = await this.$client.service('polling-event').find({})
        }
    }
})
</script>
