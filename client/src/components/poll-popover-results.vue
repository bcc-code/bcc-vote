<template>
    <div class="h-full">
        <div v-for="(option,index) in poll.answers" :key="option.answerId" class="mb-6">
            <div class="w-full result-bar flex" :style="`background: linear-gradient(to right, ${answerColors[index]} ${answerPercent[index]}%, #FFF 0%) ;`">
                <h5 class="font-bold text-white">{{option.label}}</h5>
            </div>
        </div>
        <div class="py-4">
            <h4 class="font-bold mb-8">{{$t('labels.participants')}}</h4>
            <InfoBox v-if="pollResultsAreHidden">{{$t('info.poll-anonymous')}}</InfoBox>
            <Spinner v-else />
        </div>
    </div>
</template>
<script lang="ts">
import { Poll, PollResultVisibility } from '../domain/Poll'
import { defineComponent, PropType } from 'vue'
export default defineComponent({
    props: {
        poll: Object as PropType<Poll>
    },
    data() {
        return {
            answerColors: ['#758CDF','#FFA462','#F57988'],
            answerPercent: [60,30,10]
        }
    },
    computed: {
        pollResultsAreHidden() {
            if(this.poll && this.poll.resultVisibility !== PollResultVisibility['Public']) {
                return true
            } else {
                return false
            }
        }
    }

})
</script>
<style>
.result-bar {
    border-width: 1.5px;
    @apply border-gray-200;
    @apply rounded-lg;
    @apply p-4;
}
</style>
