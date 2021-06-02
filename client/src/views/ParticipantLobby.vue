<template>
    <section>
        <div class="max-w-5xl mx-auto py-10 px-4">
            
            <div class="text-white mb-12 px-4">
                <h3 class="font-bold">{{pollingEvent.title}}</h3>
                <label>{{'Live poll'}} - {{new Date(pollingEvent.startDateTime).toLocaleDateString()}}</label>
            </div>
            <div v-if="!currentPoll" class="w-full">
                <InfoBox>
                    {{$t('info.polls-will-appear')}}
                </InfoBox>
                <Spinner />
            </div>
        </div>
        <div v-if="currentPoll" class="w-full h-full">
            <PollPopOver class="h-full w-full" :poll="currentPoll" :style="`min-height: calc(100vh - 350px);`"/>
        </div>
    </section>
</template>
<script lang="ts">
import PollPopOver from '../components/poll-popover.vue'
import { PollingEvent } from '../domain'
import { Poll } from '../domain/poll'
import { defineComponent } from 'vue'
export default defineComponent({
    components: {
        PollPopOver
    },
    data() {
        return {
            pollingEvent: {} as PollingEvent,
            currentPoll: undefined as (undefined | Poll),
        }
    },
    async created() {
        this.pollingEvent = await this.$client.service('polling-event').get(this.$route.params.id,{}) as PollingEvent
        this.$client.service('poll').on('patched', this.getPoll);
    },
    methods: {
        getPoll(data: Poll){
            this.currentPoll = data;
        }
    }
})
</script>