<template>
    <div :class="backgroundColor">
        <div class="max-w-5xl mx-auto" >
            <div class="w-full h-full px-4 py-8">
                <PollingEventPanel :pollingEvent="pollingEvent" @reloadPollingEvent="loadPollingEvent"/>

                <div class="flex py-8 gap-6 font-bold justify-center cursor-pointer" :class="inactiveTabColor">
                    <h3 :class="currentTab === 'polls' ? activeTabColor : ''" @click="currentTab='polls'">{{$t('labels.polls')}}</h3>
                    <h3 :class="currentTab === 'results' ? activeTabColor : ''"  @click="currentTab='results'">{{$t('labels.results')}}</h3>
                </div>
                <template v-if="arePollsLoaded">
                    <PollsPanel v-if="currentTab === 'polls'" :savedPolls="savedPolls" :isEventLive="isEventLive" @reloadPolls="loadSavedPolls"/>
                    <ResultsPanel v-else :savedPolls="savedPolls" :pollingEventId="pollingEvent._key"/>
                </template>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import LogInformation from '../components/log-information.vue'
import PollingEventPanel from '../components/admin-polling-event-panel.vue'
import PollsPanel from '../components/admin-polls-panel.vue'
import ResultsPanel from '../components/admin-results-panel.vue'

import { Poll } from '../domain'
import { PollingEvent, PollingEventStatus } from '../domain'

import { defineComponent } from 'vue'
export default defineComponent({
    components: {
        LogInformation,
        PollsPanel,
        ResultsPanel,
        PollingEventPanel,
    },
    data() {
        return {
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
                .catch(this.$showError)
        },
        async loadSavedPolls(){
            this.savedPolls = await this.$client.service('poll').find({
                query: {
                    pollingEventId: this.$route.params.id,
                    $sort: {
                        createdAt: 1,
                    }
                }
            }).catch(this.$showError)
        },
    } 
})
</script>
