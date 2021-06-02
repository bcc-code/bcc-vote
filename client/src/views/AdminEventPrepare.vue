<template>
  <div class="max-w-5xl mx-auto">
    <div class="w-full h-full px-4 py-8">
      <div class="form-section padding-md mb-2">
        <div class="flex justify-between items-center mb-5">
          <h2 class="font-bold">{{pollingEvent.title}}</h2>
          <PencilIcon @click="editPollingEvent" class="text-blue-900 cursor-pointer h-5"/>
        </div>
        <p class="text-gray-700">{{pollingEvent.description}}</p>
        <div class="w-full flex justify-center mt-8">
          <button class="gradient-button md-button text-lg" @click="activatePollingEvent">{{$t('actions.start-live-poll')}}</button>
        </div>
      </div>
      <div class="flex py-4 gap-6 text-gray-700  font-bold justify-center cursor-pointer">
          <h3 :class="currentTab == 'polls' ? 'text-blue-900': ''" @click="currentTab='polls'">{{$t('labels.polls')}}</h3>
          <h3 :class="currentTab == 'results' ? 'text-blue-900': ''" @click="currentTab='results'">{{$t('labels.results')}}</h3>
      </div>
      <div v-if="currentTab === 'polls'" class="form-section padding-md">
        <h3 class="font-bold">{{$t('labels.polls')}}</h3>
        <div class="pt-4 pb-8">
        <InfoBox>{{$t('info.polls-will-be-invisible')}}</InfoBox>
        </div>
        <SavedPoll v-for="(poll, ind) in savedPolls" :key="ind" :poll="poll" :pollIndex="ind + 1" class="mb-6" @edit="currentlyEdited = ind + 1" @stopEdit="currentlyEdited = 0" :active="!currentlyEdited" :editing="currentlyEdited === ind + 1"/>
        <PollForm v-if="addingPoll" class="mb-5" :eventId="$route.params.id" pollIndex="1" @close="addingPoll = false"/>
        <div class="flex justify-center pt-4">
          <div class="gradient-blue lg-button rounded-full text-white font-bold opacity-50 cursor-default"  :class="{'opacity-100 cursor-pointer': !(addingPoll || currentlyEdited)}" @click="createNewPoll">
            {{$t('actions.add-poll')}}
          </div>
        </div>
      </div>
      <div v-if="currentTab === 'results'" class="form-section padding-md">Results</div>
    </div>
  </div>
</template>
<script lang="ts">
import PencilIcon from 'heroicons-vue3/outline/PencilIcon'

import InfoBox from '../components/info-box.vue'
import PollForm from '../components/poll-form.vue'
import SavedPoll from '../components/saved-poll.vue'
import AddButton from '../components/add-button.vue'

import { PollingEvent, PollingEventStatus, PollingEventType } from '../domain'
import { Poll } from '../domain/Poll'

import { defineComponent } from 'vue'
export default defineComponent({
   components: {
        InfoBox,
        PencilIcon,
        PollForm,
        SavedPoll,
        AddButton,
    },
    data() {
      return {
        currentTab: 'polls',
        pollingEvent: {
          _id: '',
          _key: '',
          title: '',
          description: '',
          type: PollingEventType['Live Event'],
          status: PollingEventStatus['Not Started'],
          creatorId: '',
          participantFilter: {
            orgs: 'all',
            roles: 'all',
            minAge: undefined,
            maxAge: undefined
          }
        } as PollingEvent,
        savedPolls: [] as Poll[],
        addingPoll: false,
        currentlyEdited: 0,
      }
    },
    created () {
      this.loadPollingEvent();
      this.loadSavedPolls();

      this.$client.service('poll').on('created', this.addPollFromSocket)
      this.$client.service('poll').on('updated', this.updatePollFromSocket)
      this.$client.service('poll').on('removed', this.deletePollFromSocket)
    },
    methods: {
      editPollingEvent() {
        this.$router.push({ path: 'edit-polling-event', params: { id: this.pollingEvent._id } })
      },
      activatePollingEvent() {
        this.$client.service('polling_event').patch(this.pollingEvent._key, {
          status: PollingEventStatus['Live']
        }).then(() => {
          this.$router.push({ path: `/polling-event/live/${this.pollingEvent._key}`, params: { id: this.pollingEvent._key}})
        })
      },
      async loadPollingEvent(){
        this.pollingEvent = await this.$client.service('polling-event').get(this.$route.params.id);
      },
      loadSavedPolls(){
        this.$client.service('poll').find({
          query: {
            pollingEventId: this.$route.params.id
          }
        }).then((res: Poll[]) => {
          this.savedPolls = res;
        })
      },
      addPollFromSocket(data: Poll){
        this.savedPolls.push(data);
      },
      findIndex(data: Poll){
        return this.savedPolls.map((e: Poll) => e._key).indexOf(data._key);
      },
      deletePollFromSocket(data: Poll){
        const ind = this.findIndex(data);
        this.savedPolls.splice(ind, 1);
      },
      updatePollFromSocket(data: Poll){
        const ind = this.findIndex(data);
        this.savedPolls[ind] = data;
      },
      createNewPoll(){
        if(!this.currentlyEdited){
          this.addingPoll = true;
        }
      }
    }
})
</script>