<template>
  <div>
    <div class="flex justify-center items-end w-full background-home h-64 sm:h-128">
        <div class="banner-text flex items-center">
            <div class="max-w-md text-center text-blue-900">
                <h1 class="font-bold mb-3">{{$t('titles.home')}}</h1>
                <p class="hidden sm:block mb-8 pb-3">
                    {{$t('descriptions.home')}}
                </p>
                <button v-if="$canAdministratePollingEvents" @click="goToCreate" class="gradient-button md-button mt-2 md:mb-8">
                    <h4>{{$t('actions.create-polling-event')}}</h4>
                </button>
            </div>
        </div>
    </div>
    <div class="flex py-12 gap-6 font-bold justify-center text-gray-700">
        <h3 class="cursor-pointer" :class="currentTab === 'polling-events' ? 'text-blue-900' : ''" @click="currentTab='polling-events'">
            {{$t('labels.polling-events')}}
        </h3>
        <h3 v-if="$canAdministratePollingEvents" class="cursor-pointer" :class="currentTab === 'archived' ? 'text-blue-900' : ''"  @click="currentTab='archived'">
            {{$t('labels.archive')}}
        </h3>
    </div>
    <div class="max-w-screen-lg mx-auto px-4 pb-16">
        <template v-if="currentTab === 'polling-events'">
            <div v-if="pollingEvents['live'].length" class="event-grid mb-6">
                <PollingEventCard class="w-full h-full" v-for="pollingEvent in pollingEvents['live']" :key="pollingEvent" :pollingEvent="pollingEvent"/>
            </div>
            <div v-if="pollingEvents['not_started'].length" class="event-grid mb-6">
                <PollingEventCard class="w-full h-full" v-for="pollingEvent in pollingEvents['not_started']" :key="pollingEvent" :pollingEvent="pollingEvent"/>
            </div>
            <div v-if="pollingEvents['finished'].length" class="event-grid">
                <PollingEventCard class="w-full h-full" v-for="pollingEvent in pollingEvents['finished']" :key="pollingEvent" :pollingEvent="pollingEvent"/>
            </div>
            <InfoBox v-if="noEvents" class="mb-4">
                {{$t('info.no-polling-events')}}
            </InfoBox>
        </template>
        <template v-else>
            <div v-if="archivedEvents.length" class="event-grid">
                <div v-for="pollingEvent in archivedEvents" :key="pollingEvent._id">
                    <PollingEventCard class="w-full h-full" :pollingEvent="pollingEvent"/>
                </div>
            </div>
            <InfoBox v-else class="mb-4">
                {{$t('info.no-archived-events')}}
            </InfoBox>
        </template>
    </div>
  </div>
</template>
<script lang="ts">
import InfoBox from '../components/info-box.vue'
import PollingEventCard from '../components/polling-event-card.vue'

import {PollingEvent, PollingEventStatus} from '../domain'

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
            pollingEvents: {
                'not_started': [],
                'live': [],
                'finished': [],
            } as {[status: string]:Array<PollingEvent>},
            archivedEvents: [] as Array<PollingEvent>,
            currentTab: 'polling-events',
            noEvents: true,
        }
    },
    async mounted(){
        await this.loadPollingEvents()
    },
    methods: {
        goToCreate() {
            this.$router.push({ path: '/create' })
        },
        async loadPollingEvents(){
            const roleIds = this.$user.roles.map((r: any) => r.id)
            const allEvents = await this.$client.service('polling-event').find({})
            allEvents.forEach((event: PollingEvent) => {
                if(event.status === PollingEventStatus['Archived']){
                    if(event.creatorId === this.$user.personID)
                        this.archivedEvents.push(event);
                }
                else{
                    this.noEvents = false;
                    this.pollingEvents[event.status].push(event);
                }
            })
        }
    }
})
</script>

<style scoped>
    .event-grid{
        @apply grid;
        @apply grid-cols-1;
        @apply gap-6;
        @apply justify-items-stretch;
    }
    .banner-text{
        height: 190px;
    }
    @media (min-width: 720px) {
        .event-grid {
            @apply grid-cols-2
        }
    }
    @media (min-width: 640px){
        .banner-text{
            height: 310px;
        }
    }
</style>
