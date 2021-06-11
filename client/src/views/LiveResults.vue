<template>
    <div :class="[backgroundColor,'max-w-5xl mx-auto px-4']">
        <h3 class="font-bold px-4 py-6 text-blue-900">{{pollingEvent.title}}</h3>
        <div>
            <div class="w-full h-full">
                <PollingEventPanel :pollingEvent="pollingEvent" @reloadPollingEvent="loadPollingEvent"/>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import PollingEventPanel from '../components/admin-polling-event-panel.vue'
import { PollingEvent, PollingEventStatus } from '../domain'
import { defineComponent } from 'vue'
export default defineComponent({
    components: {
        PollingEventPanel,
    },
    data() {
        return {
            pollingEvent: {} as PollingEvent
        }
    },
    created(){
        this.loadPollingEvent()
    },
    computed: {
        isEventLive(): boolean{
            return this.pollingEvent.status === PollingEventStatus['Live']
        },
        backgroundColor(): string{
            return this.isEventLive? 'bg-blue-900': 'bg-gray-100'
        }
    },
    methods: {
        async loadPollingEvent(){
            this.pollingEvent = await this.$client.service('polling-event').get(this.$route.params.id)
                .catch(this.$showError)
        }
    } 
})
</script>
