<template>
    <div class="form-section padding-md">
        <template v-if="!edit">
            <div class="flex justify-between items-center mb-5">
                <h2 class="font-bold">{{pollingEvent.title}}</h2>
                <div class="flex gap-3">
                    <CopyText :toCopy="eventUrl">
                        <LinkIcon @click="getLink" class="text-blue-900 cursor-pointer h-6 w-6 p-0.5"/>
                    </CopyText>
                    <PencilIcon v-if="isEventNotStarted" @click="editPollingEvent" class="text-blue-900 cursor-pointer h-6 w-6 p-0.5"/>
                </div>
            </div>
            <p class="text-gray-700">{{pollingEvent.description}}</p>
            <div class="w-full flex justify-center mt-8">
                <div v-if="isEventNotStarted" :key="pollingEvent.status">
                    <button class="gradient-button md-button text-lg" @click="startPollingEvent">{{$t('actions.start-live-poll')}}</button>
                </div>
                <template v-else-if="isEventLive">
                    <button class="gradient-button md-button text-lg" @click="closePollingEvent">{{$t('actions.close-live-poll')}}</button>
                </template>
                <template v-else-if="isEventFinished">
                    <button class="gradient-button md-button text-lg" @click="startPollingEvent">{{$t('actions.restart-live-poll')}}</button>
                </template>
            </div>
        </template>
        <template v-else>
            <PollingEventForm :pollingEvent="pollingEvent" @close="edit = false" @finish="updateEvent"/>
        </template>
    </div>
</template>

<script lang="ts">

import PencilIcon from 'heroicons-vue3/outline/PencilIcon'
import LinkIcon from 'heroicons-vue3/outline/LinkIcon'
import CopyText from './copy-text.vue'

import { PollingEvent, PollingEventStatus} from '../domain'

import { defineComponent, PropType } from 'vue'
import PollingEventForm from './polling-event-form.vue'
export default defineComponent({
    components: {
        PencilIcon,
        LinkIcon,
        CopyText,
        PollingEventForm,
    },
    props: {
        pollingEvent: {type: Object as PropType<PollingEvent>, required: true}
    },
    data() {
        return {
            edit: false,
        }
    },
    computed: {
        eventUrl():string{
            return location.origin + '/polling-event/lobby/' + this.pollingEvent._key;
        },
        isEventNotStarted():Boolean{
            return this.pollingEvent.status === PollingEventStatus['Not Started']
        },
        isEventLive():Boolean{
            return this.pollingEvent.status === PollingEventStatus['Live']
        },
        isEventFinished():Boolean{
            return this.pollingEvent.status === PollingEventStatus['Finished']
        },
    },
    methods: {
        editPollingEvent() {
            this.edit = true;
        },
        startPollingEvent() {
            this.$client.service('polling-event').patch(this.$route.params.id, {
              status: PollingEventStatus['Live']
            }).then(() => {
               this.$emit('reloadPollingEvent')
            }).catch(this.$showError)
        },
        closePollingEvent() {
            this.$client.service('polling-event').patch(this.$route.params.id, {
              status: PollingEventStatus['Finished']
            }).then(() => {
                this.$emit('reloadPollingEvent')
            }).catch(this.$showError)
        },
        getLink(){
            const url = location.origin + '/polling-event/lobby/' + this.pollingEvent._key;
            navigator.clipboard.writeText(url)
        },
        updateEvent(){
            this.edit = false;
            this.$emit('reloadPollingEvent');
        }
    },
    emits: ['reloadPollingEvent']
})
</script>
