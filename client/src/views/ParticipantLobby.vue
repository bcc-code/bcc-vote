<template>
    <section>
        <div class="max-w-screen-md mx-auto px-4 md:px-6">
            {{testNumber}}
            <div class="flex flex-col justify-center" :style="`height: 15vh`">
                <div class="text-white">
                    <h3 class="font-bold">{{pollingEvent.title}}</h3>
                    <label>{{'Live poll'}} - {{new Date(pollingEvent.startDateTime).toLocaleDateString()}}</label>
                </div>
            </div>
            <div v-if="!currentPoll" class="w-full">
                <InfoBox>{{$t('info.polls-will-appear')}}</InfoBox>
                <Spinner />
            </div>
        </div>
        <div class="md:max-w-screen-md md:mx-auto">
            <PollPopOver v-if="currentPoll" :poll="currentPoll"/>
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
            testNumber: 0
        }
    },
    async created() {
        this.pollingEvent = await this.$client.service('polling-event').get(this.$route.params.id).catch(this.$showError) as PollingEvent

        const res = await this.$client.service('poll').find({
            query: {
                pollingEventId: this.$route.params.id,
                activeStatus: PollActiveStatus['Live']
            }
        }).catch(this.$showError)
        if(res.length > 0)
            this.currentPoll = res[0]

        this.$client.service('poll').on('patched', this.getPoll)

        setInterval(() => {
            this.testNumber++;
        }, 1000)
    },
    methods: {
        getPoll(data: Poll){
            if(data.activeStatus === PollActiveStatus['Live'])
                this.currentPoll = data
            else
                this.currentPoll = undefined
        }
    }
})
</script>
