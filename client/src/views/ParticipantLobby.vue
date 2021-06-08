<template>
    <section>
        <div class="max-w-screen-md mx-auto px-4 md:px-6">
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
import LogInformation from '../components/log-information.vue'
import { PollingEvent, PollingEventStatus } from '../domain'
import { Poll, PollActiveStatus } from '../domain/Poll'
import { defineComponent } from 'vue'
export default defineComponent({
    components: {
        PollPopOver,
        LogInformation,
    },
    data() {
        return {
            pollingEvent: {} as PollingEvent,
            currentPoll: undefined as (undefined | Poll),
        }
    },
    async created() {
        await this.init()
        
        this.$client.service('poll').on('patched', this.getPoll)

        this.$client.service('polling-event').on('patched', this.patchEvent);
        this.$client.io.on('reconnect', this.init)
    },
    methods: {
        init() {
            const a = this.loadPollingEvent();
            const b = this.loadCurrentPoll();
            return Promise.all([a, b]);
        },
        async loadPollingEvent(){
            this.pollingEvent = await this.$client.service('polling-event')
            .get(this.$route.params.id)
            .catch(this.$showError) as PollingEvent
            if(this.pollingEvent.status === PollingEventStatus['Finished'])
                this.$router.push('/thank-you')
        },
        async loadCurrentPoll(){
            const res = await this.$client.service('poll').find({
                query: {
                    pollingEventId: this.$route.params.id,
                    activeStatus: PollActiveStatus['Live']
                }
            }).catch(this.$showError)
            if(res.length > 0)
                this.currentPoll = res[0]
        },
        getPoll(data: Poll){
            if(data.activeStatus === PollActiveStatus['Live'])
                this.currentPoll = data
            else
                this.currentPoll = undefined
        },
        patchEvent(data: PollingEvent){
            if(data.status === PollingEventStatus['Finished'])
                this.$router.push('/thank-you')
        }
    }
})
</script>
