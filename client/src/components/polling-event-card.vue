<template>
    <div class="p-4 border-2 border-gray-200 rounded-lg shadow-base">
        <div class="flex items-start justify-between mb-2">
            <div>
                <label>{{formattedDate}}</label>
                <h3 class="font-bold">{{pollingEvent.title}}</h3>
            </div>
            <div :class="['px-2 border-2 rounded-lg',statusColors[pollingEvent.status]]">
                <h4 class="font-bold">{{$t(`labels.polling-event-status.${pollingEvent.status}`)}}</h4>
            </div>
        </div>
        <p class="text-gray-700 mb-10">{{pollingEvent.description}}</p>
        <div class="flex justify-center mb-3">
            <button v-if="pollingEvent.status !== 'finished'" class="gradient-button md-button" @click="goToLobby(pollingEvent._key)">
                {{$t(`actions.join-this-event`)}}
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { PollingEvent } from '../domain'
import { defineComponent, PropType } from 'vue'
export default defineComponent({
    props: {
        pollingEvent: Object as PropType<PollingEvent>,
    },
    data () {
        return {
            statusColors: {
                'live':'text-green border-green',
                'not_started':'text-gray-700 border-gray-700',
                'finished':'text-red-500 border-red-500'
            }
        }
    },
    computed: {
        formattedDate():string {
            let date = ''
            if(this.pollingEvent && this.pollingEvent.startDateTime) {
                date = new Date(this.pollingEvent.startDateTime).toLocaleDateString()
            }
            return date
        }
    },
    methods: {
        goToLobby(pollingEventKey:string) {
            this.$router.push({ path: `/polling-event/lobby/${pollingEventKey}`, params: { id: pollingEventKey}})
        },
        editPoll(pollingEventKey:string) {
            this.$router.push({ path: `/polling-event/prepare/${pollingEventKey}`, params: { id: pollingEventKey}})
        }
    }
})
</script>