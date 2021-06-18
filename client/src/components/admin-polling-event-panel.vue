<template>
    <div class="form-section padding-md">
        <template v-if="!edit">
            <div class="flex justify-between items-center mb-5">
                <h2 class="font-bold">{{pollingEvent.title}}</h2>
                <div class="flex items-center gap-3">
                    <CopyText :toCopy="eventUrl">
                        <LinkIcon @click="getLink" class="text-blue-900 cursor-pointer h-6 w-6 p-0.5"/>
                    </CopyText>
                    <PencilIcon v-if="isEventNotStarted" @click="editPollingEvent" class="text-blue-900 cursor-pointer h-6 w-6 p-0.5"/>
                    <button v-if="isEventLive" @click="openLiveResults" class="border-blue-900 border-2 sm-button rounded-xl">
                        <h5 class="text-blue-900 font-bold">{{$t('labels.show-results-live')}}</h5>
                    </button>
                </div>
            </div>
            <p v-if="pollingEvent.description" class="text-gray-700 mb-2">{{pollingEvent.description}}</p>

            <FilterInfo v-if="pollingEvent.readableFilter" :filter="pollingEvent.readableFilter"/>
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
import FilterInfo from './event-filter-info.vue'

import { PollingEvent, PollingEventStatus} from '../domain'

import { defineComponent, PropType } from 'vue'
import PollingEventForm from './polling-event-form.vue'
export default defineComponent({
    components: {
        PencilIcon,
        LinkIcon,
        CopyText,
        PollingEventForm,
        FilterInfo
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
            return location.origin + '/polling-event/lobby/' + this.pollingEvent._key
        },
        isEventNotStarted():boolean{
            return this.pollingEvent.status === PollingEventStatus['Not Started']
        },
        isEventLive():boolean{
            return this.pollingEvent.status === PollingEventStatus['Live']
        },
        isEventFinished():boolean{
            return this.pollingEvent.status === PollingEventStatus['Finished']
        },
        isEventArchived():boolean{
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
        openLiveResults() {
            let routeData = this.$router.resolve({ path: `/polling-event/live-results/${this.pollingEvent._key}`})
            window.open(routeData.href, '_blank')
        },
        updateEvent() {
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
