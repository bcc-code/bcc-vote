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
            <div class="w-full flex flex-col gap-4 md:flex-row md:gap-10 justify-center mt-8 ">
                <button v-if="isEventNotStarted || isEventFinished" class=" bg-gray-200 text-blue-900 activation-button px-15" @click="archivePollingEvent">
                    {{$t('actions.archive-polling-event')}}
                </button>
                <button v-if="isEventNotStarted" class="bg-green-500 text-white activation-button px-10" @click="startPollingEvent">
                    {{$t('actions.start-polling-event')}}
                </button>
                <button v-else-if="isEventLive" class="bg-red-500 text-white activation-button px-10" @click="closePollingEvent">
                    {{$t('actions.close-polling-event')}}
                </button>
                <button v-else-if="isEventFinished" class="bg-green-500 text-white activation-button px-10" @click="startPollingEvent">
                    {{$t('actions.restart-polling-event')}}
                </button>
                <button v-else class="bg-green-500 text-white activation-button px-10" @click="closePollingEvent">
                    {{$t('actions.unarchive-polling-event')}}
                </button>
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
        isEventArchived():Boolean{
            return this.pollingEvent.status === PollingEventStatus['Archived']
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
        archivePollingEvent(){
            this.$client.service('polling-event').patch(this.$route.params.id, {
              status: PollingEventStatus['Archived']
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

<style scoped>
    .activation-button{
        @apply font-bold;
        @apply text-lg;
        @apply rounded-full;
        @apply py-3
    }

</style>
