<template>
    <div>
        <div class="p-4 h-full flex flex-col justify-between border-2 border-gray-200 rounded-lg shadow-base cursor-pointer" @click="clickOnEvent">
            <div>
                <div class="flex items-center justify-between mb-2">
                    <div>
                        <label>{{formattedDate}}</label>
                        <h3 class="font-bold">{{pollingEvent.title}}</h3>
                    </div>
                    <div :class="['px-2 py-1 mr-1 rounded-lg border-2 flex-shrink-0',statusColors[pollingEvent.status]]">
                        <h4 class="font-bold">{{$t(`labels.polling-event-status.${pollingEvent.status}`)}}</h4>
                    </div>
                </div>
                <p class="text-gray-700 mb-10">{{pollingEvent.description}}</p>
            </div>
            <div v-if="isEventNotStarted || isEventLive" class="flex justify-center mb-3">
                <button class="primary-button md-button">
                    <template v-if="$user.personID === pollingEvent.creatorId" >
                    {{$t(`actions.admin-this-event`)}}
                    </template>
                    <template v-else>
                        {{$t(`actions.join-this-event`)}}
                    </template>
                </button>
            </div>
            <div v-else class="text-blue-900 pb-5">
                <h5 class="inline-block font-bold mr-2">{{$t('actions.view-event')}}</h5>
                <ArrowRightIcon class="h-5 inline-block"/>
            </div>
        </div>
        <transition name="fade">
            <ConfirmPopover v-if="showConfirm" @resign="showConfirm = false" @cancel="goToLogout()" @confirm="goToLobby()" cancelTranslation="logout" confirmTranslation="ok-continue">
                <div class="text-center mb-12">
                    <h3 class="font-bold mb-5">{{$t('labels.logged-as')}}
                        <span class="text-blue-900 block md:inline-block">{{$user.displayName}}</span>
                    </h3>
                    <p class="text-gray-700">{{$t('info.not-you')}}</p>
                </div>
            </ConfirmPopover>
        </transition>
    </div>
</template>

<script lang="ts">
import ConfirmPopover from './confirm-popover.vue'
import ArrowRightIcon from 'heroicons-vue3/outline/ArrowNarrowRightIcon'

import { PollingEvent, PollingEventStatus } from '../domain'
import { defineComponent, PropType } from 'vue'
import moment from 'moment'
export default defineComponent({
    components: {
        ConfirmPopover,
        ArrowRightIcon,
    },
    props: {
        pollingEvent: { type: Object as PropType<PollingEvent>, required: true }
    },
    data () {
        return {
            statusColors: {
                'live':'text-red-600 bg-red-200 border-red-600 px-6',
                'not_started':'text-blue-500 bg-blue-200 border-blue-500',
                'finished':'text-green-400 bg-green-200 border-green-400',
                'archived': 'text-gray-700 bg-gray-500 border-gray-700'
            },
            showConfirm: false,
        }
    },
    computed: {
        isEventNotStarted():boolean {
            return this.pollingEvent.status === PollingEventStatus['Not Started'];
        },
        isEventLive():boolean {
            return this.pollingEvent.status === PollingEventStatus['Live'];
        },
        formattedDate():string {
            let date = ''
            if(this.pollingEvent && this.pollingEvent.startDateTime) {
                const day = moment(this.pollingEvent.startDateTime).format('MMMM D')
                const time = moment(this.pollingEvent.startDateTime).format('HH:mm')
                date = day + ' , ' + time
            }
            return date
        }
    },
    methods: {
        goToLobby() {
            this.$router.push(`/polling-event/lobby/${this.pollingEvent._key}`);
        },
        goToLogout(){
            this.$router.push({name:'logout'})
        },
        clickOnEvent(){
            if(this.$user.personID === this.pollingEvent.creatorId)
                this.$router.push(`/polling-event/admin/${this.pollingEvent._key}`);
            else
                this.showConfirm = true
        }
    }
})
</script>
