<template>
    <div :class="backgroundColor">
        <div class="max-w-5xl mx-auto" >
            <div class="w-full h-full px-4 py-8">
                <div class="form-section padding-md">
                    <div class="flex justify-between items-center mb-5">
                        <h2 class="font-bold">{{pollingEvent.title}}</h2>
                        <PencilIcon @click="editPollingEvent" class="text-blue-900 cursor-pointer h-5"/>
                    </div>
                    <p class="text-gray-700">{{pollingEvent.description}}</p>
                    <div class="w-full flex justify-center mt-8">
                        <div v-if="isEventNotStarted" :key="pollingEvent.status">
                            <button class="gradient-button md-button text-lg" @click="startPollingEvent">{{$t('actions.start-live-poll')}}</button>
                        </div>
                        <template v-else-if="isEventLive">
                            <button class="gradient-button md-button text-lg" @click="closePollingEvent">{{$t('actions.close-live-poll')}}</button>
                        </template>
                    </div>
                </div>
                <div class="flex py-8 gap-6 font-bold justify-center cursor-pointer" :class="inactiveTabColor">
                    <h3 :class="currentTab === 'polls' ? activeTabColor : ''" @click="currentTab='polls'">{{$t('labels.polls')}}</h3>
                    <h3 :class="currentTab === 'results' ? activeTabColor : ''"  @click="currentTab='results'">{{$t('labels.results')}}</h3>
                </div>
                <PollsPanel v-if="currentTab === 'polls'" :savedPolls="savedPolls" :isEventLive="isEventLive" @reloadPolls="loadSavedPolls"/>
                <ResultsPanel v-else :savedPolls="savedPolls"/>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import InfoBox from '../components/info-box.vue'
import PollsPanel from '../components/admin-polls-panel.vue'
import PencilIcon from 'heroicons-vue3/outline/PencilIcon'

import ResultsPanel from '../components/admin-results-panel.vue'

import { Poll } from '../domain'
import { PollingEvent, PollingEventStatus } from '../domain'

import { defineComponent } from 'vue'
export default defineComponent({
    components: {
        InfoBox,
        PencilIcon,
        PollsPanel,
        ResultsPanel,
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
        isEventNotStarted():Boolean{
            return this.pollingEvent.status === PollingEventStatus['Not Started']
        },
        isEventLive():Boolean{
            return this.pollingEvent.status === PollingEventStatus['Live']
        },
        isEventFinished():Boolean{
            return this.pollingEvent.status === PollingEventStatus['Finished']
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
        editPollingEvent() {
            console.log('editing polling event');
        },
        startPollingEvent() {
            this.$client.service('polling-event').patch(this.$route.params.id, {
              status: PollingEventStatus['Live']
            }).then(() => {
              this.pollingEvent.status = PollingEventStatus['Live'];
            }).catch(this.$showError)
        },
        closePollingEvent() {
            this.$client.service('polling-event').patch(this.$route.params.id, {
              status: PollingEventStatus['Not Started']
            }).then(() => {
              this.pollingEvent.status = PollingEventStatus['Not Started'];
            }).catch(this.$showError)
        },
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
