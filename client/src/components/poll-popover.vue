<template>
    <div class="px-4 py-6 bg-white rounded-t-lg">
        <h4 class="font-bold mb-2">{{poll.title}}</h4>
        <p class="mb-10">{{poll.description}}</p>
        <div class="options">
            <div v-for="option in poll.answers" :key="option.answerId" class="mb-6">
                <button class="w-full option-button flex" :class="selectedOption == option ? 'border-blue-900' : 'border-gray-200'" @click="selectedOption = option">
                    <span class="h-5 w-5 mr-4 bg-gray-100 rounded-full" :class="selectedOption == option ? 'bg-blue-900' : 'bg-gray-100'"></span>
                    <h5 class="font-bold text-blue-900">{{option.label}}</h5>
                </button>
                <h6 v-if="selectedOption == option" class="font-bold text-gray-700 mt-2">{{option.explanation}}</h6>
            </div>
        </div>
        <div class="w-full px-6 mt-6">
            <button class="w-full rounded-full bg-blue-900 py-4" :style="selectedOption == null ? 'opacity:0.3' : ''" @click="submitAnswer(selectedOption)">
                <h5 class="font-bold text-white">{{$t('actions.vote')}}</h5>
            </button>
        </div>
  </div>
</template>
<script lang="ts">
import { Poll, Answer } from '../domain/Poll'
import { defineComponent, PropType } from 'vue'
export default defineComponent({
    props: {
        poll: Object as PropType<Poll>,
    },
    data() {
        return {
            selectedOption: null
        }
    },
    methods: {
        async submitAnswer(option:Answer) {
            if(this.poll && this.$user) {
                const participantAnswer = {
                    _from: this.poll._id,
                    _to: this.$user._id,
                    answerId: option.answerId
                }
                await this.$client.service('answer').create(participantAnswer)
                    .catch((e:Error) => this.$showError(e))
            }
        }
    }
})
</script>
<style>
.option-button {
    border-width: 1.5px;
    @apply rounded-lg;
    @apply p-4;
}

</style>
