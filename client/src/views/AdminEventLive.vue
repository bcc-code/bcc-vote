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
          <button class="gradient-button md-button text-lg" @click="closePollingEvent">{{$t('actions.close-live-poll')}}</button>
        </div>
      </div>
      <div class="form-section padding-md">
          <div class="flex justify-between">
              <h3 class="font-bold">{{$t('labels.question-queue')}}</h3>
          </div>
          <InfoBox class="my-4">{{$t('info.polls-activation-explaination')}}</InfoBox>
          <SavedPoll v-for="(poll, ind) in savedPolls" :key="ind" :poll="poll" :pollIndex="ind + 1" class="mb-6" @edit="startEditing(ind)" @stopEdit="reloadPolls" :active="!currentlyEdited" :editing="currentlyEdited === ind + 1">
            <div class='flex justify-between items-center mt-10 gap-12'>
              <label class='text-gray-700'>
                {{$t('info.publish-poll')}}
              </label>
              <h4 class="md-button font-bold gradient-blue text-white rounded-full flex-shrink-0">
                {{$t('actions.publish-poll')}}
              </h4>
            </div>
          </SavedPoll>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import InfoBox from '../components/info-box.vue'
import PollForm from '../components/poll-form.vue'
import SavedPoll from '../components/saved-poll.vue'
import PencilIcon from 'heroicons-vue3/outline/PencilIcon'
import { defineComponent } from 'vue'

import { PollingEvent, PollingEventStatus, PollingEventType } from '../domain'
import { Poll } from '../domain/Poll'

export default defineComponent({
    components: {
        InfoBox,
        PencilIcon,
        PollForm,
        SavedPoll,
    },
    data() {
      return {
        currentTab: 'polls' as string,
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
        currentlyEdited: 0,
      }
    },
    created(){
      this.loadPollingEvent();
      this.loadSavedPolls();
    },
    methods: {
      editPollingEvent() {
        this.$router.push({ path: 'edit-polling-event', params: { id: this.pollingEvent._id } })
      },
      closePollingEvent() {
        this.$router.push({ path: `/polling-event/prepare/${this.pollingEvent._key}`, params: { id: this.pollingEvent._key}})
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
      reloadPolls(){
        this.currentlyEdited = 0;
        this.loadSavedPolls();
      },
      startEditing(ind: number){
        this.currentlyEdited = ind + 1; 
      }
    }
})
</script>