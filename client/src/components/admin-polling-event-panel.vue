<template>
    <div class="form-section padding-md">
        <template v-if="!edit">
            <label class="text-gray-700">{{formattedDate}}</label>
            <div class="flex justify-between items-center mb-1">
                <div class="flex gap-5 items-center">
                    <div class="font-bold text-4.5xl">{{pollingEvent.title}}</div>
                    <EventStatus :status="pollingEvent.status"/>
                </div>
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
            <p v-if="pollingEvent.description" class="mb-2">{{pollingEvent.description}}</p>

            <FilterInfo v-if="pollingEvent.participantLabels" :filter="pollingEvent.participantLabels"/>
            <div class="w-full flex flex-col gap-4 md:flex-row md:gap-10 justify-center mt-8">
                <button v-if="isEventNotStarted || isEventFinished" class=" bg-gray-200 text-blue-900 activation-button" @click="archivePollingEvent">
                    {{$t('actions.archive-polling-event')}}
                </button>
                <button v-if="isEventNotStarted" class="bg-green-500 text-white activation-button" @click="startPollingEvent">
                    {{$t('actions.start-polling-event')}}
                </button>
                <button v-else-if="isEventLive" class="bg-red-500 text-white activation-button px-10" @click="closeConfirmation = true">
                    {{$t('actions.close-polling-event')}}
                </button>
                <button v-else-if="isEventFinished" class="bg-green-500 text-white activation-button" @click="startPollingEvent">
                    {{$t('actions.restart-polling-event')}}
                </button>
                <button v-else class="bg-green-500 text-white activation-button" @click="closePollingEvent">
                    {{$t('actions.unarchive-polling-event')}}
                </button>
            </div>
            <transition name="fade">
            <ConfirmPopover v-if="closeConfirmation" @resign="closeConfirmation = false" @cancel="closeConfirmation = false" @confirm="closePollingEvent" cancelTranslation="cancel" confirmTranslation="yes-continue">
                <template v-slot:header>{{$t('labels.sure-close-event')}}</template>
                <template v-slot:description>{{$t('info.close-event')}}</template>
            </ConfirmPopover>
        </transition>
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
import ConfirmPopover from './confirm-popover.vue'
import FilterInfo from './event-filter-info.vue'
import EventStatus from './polling-event-status.vue'

import { PollingEvent, PollingEventStatus} from '../domain'
import moment from 'moment'

import { defineComponent, PropType } from 'vue'
import PollingEventForm from './polling-event-form.vue'
export default defineComponent({
    components: {
        PencilIcon,
        LinkIcon,
        CopyText,
        PollingEventForm,
        FilterInfo,
        EventStatus,
        ConfirmPopover
    },
    props: {
        pollingEvent: {type: Object as PropType<PollingEvent>, required: true}
    },
    data() {
        return {
            edit: false,
            closeConfirmation: false
        }
    },
    computed: {
        formattedDate():string {
            return moment(this.pollingEvent.startDateTime).format("MMMM D, HH:MM")
        },
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
            this.closeConfirmation = false
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
        @apply py-3;
        @apply px-5;
    }

</style>
