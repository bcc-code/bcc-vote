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
      <div class="form-section padding-md">
        <template v-if="currentTab === 'polls'">
          <div class="flex justify-between mb-4">
              <h3 class="font-bold">{{isEventLive? $t('labels.poll-queue'): $t('labels.polls')}}</h3>
          </div>
          <InfoBox class="mb-5">{{isEventLive ? $t('info.polls-activation-explaination') : $t('info.polls-will-be-invisible')}}</InfoBox>
          <SavedPoll v-for="(poll, ind) in savedPolls" :key="ind" :poll="poll" :pollIndex="ind + 1" class="mb-6" @edit="startEditing(ind)" @stopEdit="reloadPolls" :active="!currentlyEdited" :editing="currentlyEdited === ind + 1">
            <div v-if="isEventLive" class='flex justify-between items-center mt-10 gap-12'>
              <label class='text-gray-700'>
                <template v-if="isNotStarted(poll)">
                  {{$t('info.publish-poll')}}
                </template>
                <template v-if="isLive(poll)">
                  {{$t('info.close-poll')}}
                </template>
                <template v-if="isFinished(poll)">
                  {{$t('info.republish-poll')}}
                </template>
              </label>
              <h5 class="md-button rounded-full flex-shrink-0 cursor-pointer font-bold" :class="{'gradient-blue text-white': !isFinished(poll), 'text-red-500 border-2 border-red-500': isFinished(poll)}" @click="changePollStatus(poll)">
                <template v-if="isNotStarted(poll)">
                  {{$t('actions.publish-poll')}}
                </template>
                <template v-if="isLive(poll)">
                  {{$t('actions.close-poll')}}
                </template>
                <template v-if="isFinished(poll)">
                  {{$t('actions.republish-poll')}}
                </template>
              </h5>
            </div>
          </SavedPoll>
          <PollForm v-if="addingPoll" class="mb-5" :eventId="$route.params.id" pollIndex="1" @close="reloadPolls"/>
          <div class="flex justify-center pt-4">
              <div class="gradient-blue lg-button rounded-full text-white font-bold opacity-50 cursor-default"  :class="{'opacity-100 cursor-pointer': !(addingPoll || currentlyEdited)}" @click="createNewPoll">
                  {{$t('actions.add-poll')}}
              </div>
          </div>
        </template>
        <template v-else>
          <div class="flex justify-between font-bold mb-8">
            <h3>{{$t('label.event-results')}}</h3>
            <div class="flex text-blue-900 items-center"> 
              <ClipboardListIcon class="h-6 w-6"/>
              <h5 class="py-1">{{$t('actions.get-report')}}</h5>
            </div>
          </div>
          <div class="grid grid-flow-row grid-cols-2 gap-6">
            <PollResultTile v-for="poll in savedPolls" :key="poll._key" :poll="poll"/>
          </div>
        </template>
      </div>
    </div>
  </div>
  </div>
</template>
<script lang="ts">
import InfoBox from '../components/info-box.vue'
import SavedPoll from '../components/saved-poll.vue'
import PollForm from '../components/poll-form.vue'
import PollResultTile from '../components/poll-result-tile.vue'
import PencilIcon from 'heroicons-vue3/outline/PencilIcon'
import ClipboardListIcon from 'heroicons-vue3/outline/ClipboardListIcon'

import { PollingEvent, PollingEventStatus } from '../domain'
import { Poll, PollActiveStatus } from '../domain/Poll'

import { defineComponent } from 'vue'
export default defineComponent({
    components: {
        InfoBox,
        PencilIcon,
        SavedPoll,
        PollForm,
        PollResultTile,
        ClipboardListIcon,
    },
    data() {
        return {
            currentTab: 'polls' as string,
            pollingEvent: {} as PollingEvent,
            savedPolls: [] as Poll[],
            addingPoll: false,
            currentlyEdited: 0,
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
        async changePollStatus(poll: Poll){
            if(poll.activeStatus === PollActiveStatus["Live"])
                await this.setActivePoll()
            else{
                await this.setActivePoll(poll)
            }
            this.reloadPolls()
        },
        async loadPollingEvent(){
            this.pollingEvent = await this.$client.service('polling-event').get(this.$route.params.id)
                .catch(this.$showError)
        },
        loadSavedPolls(){
            this.$client.service('poll').find({
                query: {
                    pollingEventId: this.$route.params.id,
                    $sort: {
                        createdAt: 1,
                    }
                }
            }).then((res: Poll[]) => {
                this.savedPolls = res
            }).catch(this.$showError)
        },
        createNewPoll(){
            if(!this.currentlyEdited){
                this.addingPoll = true
            }
        },
        reloadPolls(){
            this.currentlyEdited = 0
            this.addingPoll = false
            this.loadSavedPolls()
        },
        startEditing(ind: number){
            this.currentlyEdited = ind + 1 
            this.addingPoll=false
        },
        findPollByKey(key: string): number{
            return this.savedPolls.findIndex((a: Poll) => {
                return a._key === key
            })
        },
        isNotStarted(p: Poll):boolean{
            return p.activeStatus === PollActiveStatus['Not Started']
        },
        isLive(p: Poll):boolean{
            return p.activeStatus === PollActiveStatus['Live']
        },
        isFinished(p: Poll):boolean{
            return p.activeStatus === PollActiveStatus['Finished']
        },
        async setActivePoll(p?: Poll){
            const ind =  this.savedPolls.findIndex(this.isLive)
            if(ind > -1)
                await this.$client.service('poll').patch(this.savedPolls[ind]._key, {
                    activeStatus: PollActiveStatus['Finished']
                }).catch(this.$showError)
            if(p)
                await this.$client.service('poll').patch(p._key, {
                    activeStatus: PollActiveStatus['Live']
                }).catch(this.$showError)
        }
    } 
})
</script>
