<template>
    <section>
        <div class="max-w-5xl mx-auto py-10 px-4">
            
            <div class="text-white mb-12 px-4">
                <h3 class="font-bold">{{pollingEvent.title}}</h3>
                <label>{{'Live poll'}} - {{new Date(pollingEvent.startDateTime).toLocaleDateString()}}</label>
            </div>
            <div v-if="!polls.length" class="w-full">
                <InfoBox>
                    {{$t('info.polls-will-appear')}}
                </InfoBox>
                <Spinner />
            </div>
        </div>
        <div v-if="polls.length" class="w-full h-full">
            <PollPopOver class="h-full w-full" :poll="polls[0]" :style="`min-height: calc(100vh - 350px);`"/>
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