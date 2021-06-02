<template>
  <div>
    <div class="flex justify-center items-center w-full background-home h-64 sm:h-128">
        <div class="max-w-md text-center text-blue-900 pt-12 sm:pt-32">
            <h1 class="font-bold">{{$t('titles.home')}}</h1>
            <p class="hidden sm:block mt-1">
                {{$t('descriptions.home')}}
            </p>
            <button v-if="$canAdministratePollingEvents" @click="goToCreate" class="gradient-button md-button mt-5">
                <h4>{{$t('actions.create-meeting')}}</h4>
            </button>
        </div>
    </div>
    <div class="max-w-screen-lg mx-auto px-4 pt-8">
        <h2 class="font-bold mb-8">{{$t('labels.polling-events')}}</h2>
        <div>
            <div v-if="pollingEvents.length">
                <div v-for="pollingEvent in pollingEvents" :key="pollingEvent._id">
                    <PollingEventCard class="w-full md:w-1/2 mb-8" :pollingEvent="pollingEvent"/>
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
            pollingEvents: [],
        }
    },
    async mounted(){
        await this.loadMeetings();
    },
    methods: {
        goToCreate() {
            this.$router.push({ path: '/create' })
        },
        async loadMeetings(){
            const roleIds = this.$user.roles.map((r:any) => r.id)
            this.pollingEvents = await this.$client.service('polling-event').find({})
        }
    }
})
</script>
