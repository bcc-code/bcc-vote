<template>
    <section>
        <div class="max-w-screen-md mx-auto px-4 md:px-6">
            <h3 class="font-bold text-white py-6">{{pollingEvent.title}}</h3>
            <div v-if="!currentPoll" class="w-full">
                <InfoBox>{{$t('info.polls-will-appear')}}</InfoBox>
                <Spinner />
            </div>
        </div>
        <div class="md:max-w-screen-md md:mx-auto">
            <PollPopOver v-if="currentPoll" :poll="currentPoll" :key="currentPoll"/>
        </div>
    </section>
</template>
<script lang="ts">
import PollPopOver from '../components/poll-popover.vue'
import { PollingEvent, PollingEventStatus } from '../domain'
import { Poll, PollActiveStatus } from '../domain/Poll'
import { defineComponent } from 'vue'
export default defineComponent({
    components: {
        PollPopOver,
    },
    data() {
        return {
            pollingEvent: {} as PollingEvent,
            currentPoll: undefined as (undefined | Poll),
        }
    },
    created() {
        this.init()
        
        this.$client.service('poll').on('patched', this.getPoll)
        this.$client.service('polling-event').on('patched', this.patchEvent);
        this.$client.io.on('reconnect', this.init)
    },
    unmounted(){
        this.$client.service('poll').off('patched')
        this.$client.service('polling-event').off('patched');
    },
    methods: {
        init() {
            this.loadPollingEvent();
            this.loadCurrentPoll();
        },
        async loadPollingEvent(){
            this.pollingEvent = await this.$client.service('polling-event')
            .get(this.$route.params.id)
            .catch(this.$handleError) as PollingEvent
            if(this.pollingEvent.status === PollingEventStatus['Finished'])
                this.goToThankYouPage(this.pollingEvent);
        },
        async loadCurrentPoll(){
            const res = await this.$client.service('poll').find({
                query: {
                    pollingEventId: this.$route.params.id,
                    activeStatus: PollActiveStatus['Live']
                }
            }).catch(this.$handleError)
            if(res.length > 0)
                this.currentPoll = res[0]
        },
        getPoll(data: Poll){
            if(data.pollingEventId !== this.$route.params.id)
                return
            if(data.activeStatus === PollActiveStatus['Live'])
                this.currentPoll = data
            else
                this.currentPoll = undefined
        },
        patchEvent(data: PollingEvent){
            if(data._key === this.$route.params.id && data.status === PollingEventStatus['Finished'])
                this.goToThankYouPage(data);
        },
        goToThankYouPage(data: PollingEvent){
            this.$router.push({name: 'Thank you', params: {
                id: data._key,
                title: data.title
            }})
        }
    }
})
</script>
