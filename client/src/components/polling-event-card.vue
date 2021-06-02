<template>
    <div class="px-4 py-6 border-2 border-gray-200 rounded-lg">
        <div class="mb-3 flex justify-between">
            <h3 class="font-bold">{{pollingEvent.title}}</h3>
            <div class="px-2 border-2 rounded-lg">
                <h4 class="font-bold">{{$t(`labels.polling-event-status.${pollingEvent.status}`)}}</h4>
            </div>
        </div>
        <div class="flex justify-center">
            <button class="gradient-button md-button" @click="goToLobby(pollingEvent._key)">
                {{$t('actions.participate-in-voting')}}
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
            pollingStatus: {
                
            }
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
