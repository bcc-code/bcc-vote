<template>
    <section>
        <div class="max-w-screen-md mx-auto px-4" :style="`height: 15vh`">
            <div class="h-full flex flex-col justify-center">
                <div class="text-white">
                    <h3 class="font-bold">{{pollingEvent.title}}</h3>
                    <label>{{'Live poll'}} - {{new Date(pollingEvent.startDateTime).toLocaleDateString()}}</label>
                </div>
            </div>
        </div>
        <div v-if="!polls.length" class="w-full px-4 ">
            <InfoBox>
                {{$t('info.polls-will-appear')}}
            </InfoBox>
            <Spinner />
        </div>
        <div v-if="currentPoll" class="w-full h-full">
            <PollPopOver class="h-full w-full" :poll="currentPoll" :style="`height: 75vh`"/>
        </div>
    </section>
</template>
<script lang="ts">
import PollPopOver from '../components/poll-popover.vue'
import { PollingEvent } from '../domain'
import { Poll } from '../domain/Poll'
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