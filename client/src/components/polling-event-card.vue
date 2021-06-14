<template>
    <div>
        <div class="p-4 h-full flex flex-col justify-between border-2 border-gray-200 rounded-lg shadow-base">
            <div>
                <div class="flex items-center justify-between mb-2">
                    <div>
                        <label>{{formattedDate}}</label>
                        <h3 class="font-bold">{{pollingEvent.title}}</h3>
                    </div>
                    <div :class="['px-2 py-0.5 mr-1 rounded-lg border-2 flex-shrink-0',statusColors[pollingEvent.status]]">
                        <h4 class="font-bold">{{$t(`labels.polling-event-status.${pollingEvent.status}`)}}</h4>
                    </div>
                </div>
                <p class="text-gray-700 text-limit-2">{{pollingEvent.description}}</p>
            </div>
            <div class="flex justify-center mb-3 gap-5">
                <button v-if="$user.personID === pollingEvent.creatorId" class="md-button text-blue-900 bg-gray-500 font-bold rounded-full mt-10" @click="goToAdmin()">
                    {{$t(`actions.admin-this-event`)}}
                </button>
                <button v-if="canParticipate" class="md-button rounded-full text-white bg-blue-900 font-bold mt-10" @click="showConfirm = true">
                        {{$t(`actions.join-this-event`)}}
                </button>
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
        },
        canParticipate():boolean{
            if(this.pollingEvent.status === PollingEventStatus['Finished'])
                return false
            if(this.pollingEvent.status === PollingEventStatus['Archived'])
                return false
            const rolesEnum: string[] = this.$user.roles.map((r:any) => r.enumName);
            const filter = this.pollingEvent.participantFilter;
            if(this.$user.age >= filter.maxAge)
                return false;
            if(this.$user.age < filter.minAge)
                return false;
            if(filter.org !== 'all' && this.$user.churchID != filter.org)
                return false;
            if(filter.role !== 'all' && !rolesEnum.includes(filter.role))
                return false
            return true
        }
    },
    methods: {
        goToLobby() {
            this.$router.push(`/polling-event/lobby/${this.pollingEvent._key}`)
        },
        goToLogout(){
            this.$router.push({name:'logout'})
        },
        goToAdmin() {
            this.$router.push(`/polling-event/admin/${this.pollingEvent._key}`)
        }
    }
})
</script>

<style scoped>
.text-limit-2 {
   overflow: hidden;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 2;
   -webkit-box-orient: vertical;
}
</style>
