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
        <div v-if="polls.length" class="w-full md:max-w-screen-md md:mx-auto h-full">
            <PollPopOver class="h-full w-full" :poll="polls[0]" :style="`height: 75vh`"/>
        </div>
    </section>
</template>
<script lang="ts">
import PollPopOver from '../components/poll-popover.vue'
import { PollingEvent } from '../domain'
import { defineComponent } from 'vue'
export default defineComponent({
    components: {
        PollPopOver
    },
    data() {
        return {
            pollingEvent: {} as PollingEvent,
            polls: []
        }
    },
    async created() {
        this.pollingEvent = await this.$client.service('polling-event').get(this.$route.params.id,{}) as PollingEvent
        setTimeout(async () => {
            this.polls = await this.$client.service('poll').find({})
        },2000)
    }
})
</script>