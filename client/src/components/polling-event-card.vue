<template>
    <div class="p-4 border-2 border-gray-200 rounded-lg shadow-base">
        <div class="flex items-center justify-between mb-2">
            <div>
                <label>{{formattedDate}}</label>
                <h3 class="font-bold">{{pollingEvent.title}}</h3>
            </div>
            <div :class="['px-6 py-1 mr-1 rounded-lg',statusColors[pollingEvent.status]]">
                <h4 class="font-bold">{{$t(`labels.polling-event-status.${pollingEvent.status}`)}}</h4>
            </div>
        </div>
        <p class="text-gray-700 mb-10">{{pollingEvent.description}}</p>
        <div class="flex justify-center mb-3">
            <button v-if="$user.personID === pollingEvent.creatorId" class="gradient-button md-button" @click="adminEvent(pollingEvent._key)">
                {{$t(`actions.admin-this-event`)}}
            </button>
            <button v-else-if="pollingEvent.status !== 'finished'" class="gradient-button md-button" @click="goToLobby(pollingEvent._key)">
                {{$t(`actions.join-this-event`)}}
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { PollingEvent } from '../domain'
import { defineComponent, PropType } from 'vue'
import moment from 'moment'
export default defineComponent({
    props: {
        pollingEvent: Object as PropType<PollingEvent>,
    },
    data () {
        return {
            statusColors: {
                'live':'text-red-600 bg-red-200',
                'not_started':'text-bland-green bg-bland-green',
                'finished':'text-gray-700 bg-gray-200'
            }
        }
    },
    computed: {
        formattedDate():string {
            let date = ''
            if(this.pollingEvent && this.pollingEvent.startDateTime) {
                const day = moment(this.pollingEvent.startDateTime).format('MMMM D')
                const time = moment(this.pollingEvent.startDateTime).format('hh:mm')
                date = day + ' , ' + time
            }
            return date
        }
    },
    methods: {
        goToLobby(pollingEventKey:string) {
            this.$router.push({ path: `/polling-event/lobby/${pollingEventKey}`, params: { id: pollingEventKey}})
        },
        adminEvent(pollingEventKey:string) {
            this.$router.push({ path: `/polling-event/prepare/${pollingEventKey}`, params: { id: pollingEventKey}})
        }
    }
})
</script>