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
import { Poll, PollActiveStatus } from '../domain/Poll'
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
        this.pollingEvent = await this.$client.service('polling-event').get(this.$route.params.id) as PollingEvent

        const res = await this.$client.service('poll').find({
            query: {
                pollingEventId: this.$route.params.id,
                activeStatus: PollActiveStatus['Live']
            }
        })
        if(res.length > 0)
            this.currentPoll = res[0];

        this.$client.service('poll').on('patched', this.getPoll);
    },
    methods: {
        getPoll(data: Poll){
            if(data.activeStatus === PollActiveStatus['Live'])
                this.currentPoll = data;
            else
                this.currentPoll = undefined;
        }
    }
})
</script>