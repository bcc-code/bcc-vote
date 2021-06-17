<template>
  <div>
    <div class="flex justify-center items-end w-full background-home h-64 sm:h-128">
        <div class="banner-text flex items-center">
            <div class="max-w-md text-center text-blue-900">
                <h1 class="font-bold mb-3 md:mb-10">{{$t('titles.home')}}</h1>
                <button v-if="$canAdministratePollingEvents" @click="goToCreate" class="primary-button md-button mt-2 md:mb-8">
                    <h4>{{$t('actions.create-polling-event')}}</h4>
                </button>
            </div>
        </div>
    </div>
    <div class="flex py-12 gap-6 font-bold justify-center text-gray-700">
        <h3 class="cursor-pointer" :class="currentTab === 'polling-events' ? 'text-blue-900' : ''" @click="currentTab='polling-events'">
            {{$t('labels.polling-events')}}
        </h3>
        <h3 v-if="$canAdministratePollingEvents" class="cursor-pointer" :class="currentTab === 'archived' ? 'text-blue-900' : ''"  @click="openArchivedTab">
            {{$t('labels.archive')}}
        </h3>
    </div>
    <div class="max-w-screen-lg mx-auto px-4 pb-16">
        <Spinner v-if="loading" inline />
        <div v-else>
            <div v-if="tabPollingEvents.length" class="event-grid mb-6">
                <PollingEventCard class="w-full h-full" v-for="pollingEvent in tabPollingEvents" :key="pollingEvent" :pollingEvent="pollingEvent"/>
            </div>
            <InfoBox v-else class="mb-4">
                {{currentTab !== 'archived' ? $t('info.no-polling-events') : $t('info.no-archived-events')}}
            </InfoBox>
        </div>
    </div>
  </div>
</template>
<script lang="ts">
import InfoBox from '../components/info-box.vue'
import PollingEventCard from '../components/polling-event-card.vue'
import {PollingEvent} from '../domain'
import { mapState, mapActions } from 'vuex'
import { defineComponent } from 'vue'
export default defineComponent({
    components: {
        InfoBox,
        PollingEventCard
    },
    props: {
        mobile: Boolean,
    },
    created(){
        this.loadPollingEvents()
    },
    data () {
        return {
            loading: false,
            loadedArchived: false,
            currentTab: 'polling-events'
        }
    },
    computed: {
        ...mapState(['pollingEvents']),
        sortedPollingEvents() {
            let events = {
                'not_started': [],
                'live': [],
                'finished': [],
                'archived': []
            } as any
            this.pollingEvents.forEach((event: PollingEvent) => {
                events[event.status].push(event)
            })
            return events
        },
        tabPollingEvents():Array<PollingEvent> {
            const events = this.sortedPollingEvents
            if(this.currentTab === 'archived') {
                return [...events['archived']]
            } else {
                return [
                    ...events['live'],
                    ...events['not_started'],
                    ...events['finished']
                ]
            }
        }
    },
    methods: {
        ...mapActions(['findPollingEvents']),
        async loadPollingEvents(archived = false) {
            this.loading = true
            await this.findPollingEvents(archived)
            this.loading = false
        },
        openArchivedTab() {
            this.currentTab = 'archived'
            if(!this.loadedArchived) {
                this.loadPollingEvents(true)
                this.loadedArchived = true
            }
        },
        goToCreate() {
            this.$router.push({ path: '/create' })
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
    @media (min-width: 768px) {
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
