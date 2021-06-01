<template>
    <div class="max-w-5xl mx-auto">
        <h3 class="font-bold text-white">{{pollingEvent.title}}</h3>
        <div class="w-full h-full px-4 py-8">
            <div class="form-section padding-md">
                <div class="flex justify-between">
                    <h3 class="font-bold">{{$t('question-queue')}}</h3>
                </div>
                <InfoBox class="m-4">{{$t('info.polls-activation-explaination')}}</InfoBox>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import InfoBox from '../components/info-box.vue'
import { PollingEvent } from '../domain'
import { defineComponent } from 'vue'
export default defineComponent({
    components: {
        InfoBox
    },
    data() {
        return {
            pollingEvent: {} as PollingEvent
        }
    },
    async created() {
        const result = await this.$client.service('polling-event').get(this.$route.params.id,{})
        this.pollingEvent = result as PollingEvent
    }
})
</script>