<template>
  <div class="max-w-5xl mx-auto">
    <div class="w-full h-full px-4 py-8">
      <div class="form-section padding-md mb-2">
        <div class="flex justify-between items-center mb-5">
          <h2 class="font-bold">{{pollingEvent.title}}</h2>
          <PencilIcon @click="editPollingEvent(pollingEvent._key)" class="text-blue-900 cursor-pointer h-5"/>
        </div>
        <p class="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce pretium porta interdum. Ut felis diam, tristique in tellus et, maximus molestie eros.</p>
        <div class="w-full flex justify-center mt-8">
          <button class="gradient-button md-button text-lg" @click="activatePollingEvent(pollingEvent._key)">{{$t('actions.start-live-poll')}}</button>
        </div>
      </div>
      <div class="flex py-4 gap-6 text-gray-700  font-bold justify-center cursor-pointer">
          <h3 :class="currentTab == 'polls' ? 'text-blue-900': ''" @click="currentTab='polls'">{{$t('labels.polls')}}</h3>
          <h3 :class="currentTab == 'results' ? 'text-blue-900': ''" @click="currentTab='results'">{{$t('labels.results')}}</h3>
      </div>
      <div v-if="currentTab === 'polls'" class="form-section padding-md">
        <InfoBox class="m-4">{{$t('info.polls-will-be-invisible')}}</InfoBox>
      </div>
      <div v-if="currentTab === 'results'" class="form-section padding-md">Results</div>
    </div>
  </div>
</template>
<script lang="ts">
import PencilIcon from 'heroicons-vue3/outline/PencilIcon'
import InfoBox from '../components/info-box.vue'
import { defineComponent } from 'vue'
export default defineComponent({
    components: {
        InfoBox,
        PencilIcon
    },
    data() {
        return {
            currentTab: 'polls',
            pollingEvent: {
                _id: '',
                _key: '',
                title: "Yearly Meeting",
                description: "Yearly Meeting in Oslo",
                startDateTime: null,
                type: "poll",
                creatorId: "person/122324242",
                participantFilter: {
                    orgs: [],
                    roles: [],
                    minAge: 10,
                    maxAge: 100
                }
            }
        }
    },
    methods: {
        editPollingEvent(pollingEventKey:string) {
            this.$router.push({ path: 'edit-polling-event', params: { id: pollingEventKey } })
        },
        activatePollingEvent(pollingEventKey:string) {
            this.$router.push({ path: `/polling-event/live/${pollingEventKey}`, params: { id: pollingEventKey}})
        }
    }
})
</script>