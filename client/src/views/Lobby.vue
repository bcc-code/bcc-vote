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
            <PollPopOver v-if="currentPoll" :poll="currentPoll" :answer="currentAnswer" :key="currentPoll" @answered="currentAnswer = $event"/>
        </div>
    </section>
</template>
<script lang="ts">
import PollPopOver from '../components/poll-popover.vue'
import { PollingEvent, PollingEventStatus } from '../domain'
import { Answer, Poll, PollActiveStatus } from '../domain/Poll'
import { defineComponent } from 'vue'
export default defineComponent({
    components: {
        PollPopOver,
    },
    data() {
        return {
            pollingEvent: {} as PollingEvent,
            currentPoll: undefined as (undefined | Poll),
            currentAnswer: undefined as (undefined | Answer)
        }
    },
    created() {
        this.init()
        
        this.$client.service('poll').on('patched', this.getPoll)
        this.$client.service('polling-event').on('patched', this.patchEvent)
        this.$client.io.on('reconnect', this.init)
    },
    unmounted(){
        this.$client.service('poll').off('patched')
        this.$client.service('polling-event').off('patched')
    },
    methods: {
        init():void {
            this.loadPollingEvent()
            this.loadCurrentPoll()
        },
        async loadPollingEvent():Promise<void>{
            this.pollingEvent = await this.$client.service('polling-event')
                .get(this.$route.params.id)
                .catch(this.$handleError) as PollingEvent
            if(this.pollingEvent.status === PollingEventStatus['Finished'])
                this.goToThankYouPage(this.pollingEvent)
        },
        async loadCurrentPoll():Promise<void>{
            const res = await this.$client.service('poll').find({
                query: {
                    pollingEventId: this.$route.params.id,
                    activeStatus: PollActiveStatus['Live']
                }
            }).catch(this.$handleError)
            if(res.length === 0){
                this.currentPoll = undefined
                this.currentAnswer = undefined
            }
            else{
                this.currentAnswer = await this.loadCurrentAnswer(res[0]._key)
                this.currentPoll = res[0]
            }
        },
        async loadCurrentAnswer(pollId: string):Promise<undefined|Answer>{
            const res = await this.$client.service('answer').get(pollId + '-' + this.$user._key)
                .catch((err:Error) => {
                    if(err.name !== 'NotFound')
                        this.$handleError(err)
                })

            return res
        },
        getPoll(data: Poll):void{
            if(data.pollingEventId !== this.$route.params.id)
                return

            this.currentAnswer = undefined
            if(data.activeStatus === PollActiveStatus['Live'])
                this.currentPoll = data
            else
                this.currentPoll = undefined
        },
        patchEvent(data: PollingEvent):void{
            if(data._key === this.$route.params.id && data.status === PollingEventStatus['Finished'])
                this.goToThankYouPage(data)
        },
        goToThankYouPage(data: PollingEvent):void{
            this.$router.push({name: 'Thank you', params: {
                id: data._key,
                title: data.title
            }})
        }
    }
})
</script>
