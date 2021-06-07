<template>
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
</template>

<script lang="ts">
import { PollingEvent} from '../domain'

import { defineComponent, PropType } from 'vue'

export default defineComponent({
    props: {
        pollingEvent: Object as PropType<PollingEvent>
    },
})
</script>
