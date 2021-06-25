<template>
    <div :class="backgroundColor">
        <div class="max-w-5xl mx-auto">
            <div class="w-full h-full px-4 py-8">
                <PollingEventPanel v-if="isEventLoaded" :pollingEvent="pollingEvent" @reloadPollingEvent="loadPollingEvent"/>
                <Spinner v-else inline/>
                <div class="flex py-8 gap-6 font-bold justify-center" :class="inactiveTabColor">
                    <h3 v-if="!isEventFinished && !isEventArchived" class="cursor-pointer" :class="currentTab === 'polls' ? activeTabColor : ''" @click="currentTab='polls'">{{$t('labels.polls')}}</h3>
                    <h3 class="cursor-pointer" :class="currentTab === 'results' ? activeTabColor : ''"  @click="currentTab='results'">{{$t('labels.results')}}</h3>
                </div>
                <template v-if="arePollsLoaded">
                    <PollsPanel v-if="currentTab === 'polls'" :savedPolls="savedPolls" :isEventLive="isEventLive" @reloadPolls="loadSavedPolls"/>
                    <ResultsPanel v-else :savedPolls="savedPolls" :pollingEvent="pollingEvent"/>
                </template>
                <Spinner v-else inline/>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import PollingEventPanel from '../components/admin-polling-event-panel.vue'
import PollsPanel from '../components/admin-polls-panel.vue'
import ResultsPanel from '../components/admin-results-panel.vue'
import { Poll } from '../domain'
import { PollingEvent, PollingEventStatus } from '../domain'
import { defineComponent } from 'vue'
import Spinner from '../components/spinner.vue'
export default defineComponent({
    components: {
        PollsPanel,
        ResultsPanel,
        PollingEventPanel,
        Spinner,
    },
    data() {
        return {
            arePollsLoaded: false as boolean,
            isEventLoaded: false as boolean,
            currentTab: 'polls' as string,
            pollingEvent: {} as PollingEvent,
            savedPolls: [] as Poll[],
        }
    },
    created(){
        this.loadPollingEvent()
        this.loadSavedPolls()
    },
    computed: {
        isEventLive():Boolean{
            return this.pollingEvent.status === PollingEventStatus['Live']
        },
        isEventFinished():Boolean{
            return this.pollingEvent.status === PollingEventStatus['Finished']
        },
        isEventArchived():Boolean{
            return this.pollingEvent.status === PollingEventStatus['Archived']
        },
        backgroundColor(): String{
            return this.isEventLive? 'bg-blue-900': 'bg-gray-100'
        },
        activeTabColor():String{
            return this.isEventLive? 'text-white': 'text-blue-900'
        },
        inactiveTabColor():String{
            return this.isEventLive? 'text-gray-600': 'text-gray-700'
        },
    },
    methods: {
        async loadPollingEvent(){
            this.pollingEvent = await this.$client.service('polling-event').get(this.$route.params.id)
                .catch(this.$handleError)
            this.isEventLoaded = true
            if(this.isEventFinished || this.isEventArchived)
                this.currentTab = 'results';
        },
        async loadSavedPolls(){
            this.savedPolls = await this.$client.service('poll').find({
                query: {
                    pollingEventId: this.$route.params.id,
                    $sort: {
                        createdAt: 1,
                    }
                }
            }).catch(this.$handleError)
            this.arePollsLoaded = true;
        },
    } 
})
</script>
