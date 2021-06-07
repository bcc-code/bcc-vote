<template>
    <div class="form-section padding-md">
        <div class="flex justify-between font-bold mb-8">
            <h3>{{$t('labels.event-results')}}</h3>
            <router-link :to="`/polling-event/report/${pollingEventId}`">
                <div class="flex text-blue-900 items-center cursor-pointer"> 
                    <ClipboardListIcon class="h-6 w-6"/>
                    <h5 class="py-1">{{$t('actions.get-report')}}</h5>
                </div>
            </router-link>
        </div>
        <div class="grid grid-flow-row grid-cols-2 gap-6">
            <PollResultTile v-for="poll in savedPolls" :key="poll._key" :poll="poll"/>
        </div>
  </div>
</template>
<script lang="ts">

import ClipboardListIcon from 'heroicons-vue3/outline/ClipboardListIcon'
import PollResultTile from '../components/poll-result-tile.vue'

import { defineComponent, PropType } from 'vue'
import { Poll } from '../domain'

export default defineComponent({
    components: {
        ClipboardListIcon,
        PollResultTile,
    },
    props: {
        pollingEventId: String,
        savedPolls: {type: Array as PropType<Poll[]>, required: true}
    }
})
</script>

