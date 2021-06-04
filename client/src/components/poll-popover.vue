<template>
    <div class="h-full w-full bg-white rounded-t-lg relative" :style="`min-height: calc(85vh - 96px);`">
        <div class="h-full w-full px-4 md:px-6 p-8" :class="hasSavedAnswer ? 'relative' : 'absolute overflow-hidden'">
            <h4 class="font-bold mb-2">{{poll.title}}</h4>
            <p>{{poll.description}}</p>
            <div v-if="!hasSavedAnswer" class="h-full pt-10 pb-20">
                <PollVote :options="poll.answers" @vote="checkConfirm"/>
            </div>
            <div v-else class="py-10">
                <PollResults :poll="poll" :key="poll._key"/>
            </div>
        </div>
        <div class="h-1/2 w-full absolute bg-white rounded-t-lg p-10" :class="showConfirm && !hasSavedAnswer ? 'h-full' : 'hidden'">
            <div class="h-full flex flex-col justify-around"> 
                <div class="text-center">
                    <h1 class="font-bold mb-3">{{$t('labels.vote-confirmation')}}</h1>
                    <p>{{chosenOption.explanation}}</p>
                </div>
                <div class="w-full pb-6 flex justify-between">
                    <button class="w-full rounded-full p-4 bg-gray-200 mx-2" @click="showConfirm = false">
                        <h5 class="font-bold text-white">{{$t('actions.cancel')}}</h5>
                    </button>
                    <button class="w-full rounded-full p-4 bg-blue-900 mx-2" @click="submitAnswer(chosenOption)">
                        <h5 class="font-bold text-white">{{$t('actions.confirm')}}</h5>
                    </button>
                </div>
            </div>
        </div>
  </div>
</template>
<script lang="ts">
import PollVote from './poll-vote.vue'
import PollResults from './poll-results.vue'
import { Poll, Answer } from '../domain/Poll'
import { defineComponent, PropType } from 'vue'
export default defineComponent({
    components: {
        PollVote,
        PollResults
    },
    props: {
        poll: Object as PropType<Poll>,
    },
    data() {
        return {
            showConfirm: false as boolean,
            chosenOption: {} as Answer,
            hasSavedAnswer: false as boolean
        }
    },
    methods: {
        checkConfirm(option:Answer) {
            this.chosenOption = option
            this.showConfirm = true
        },
        async submitAnswer(option:Answer) {
            if(this.poll && this.$user) {
                const participantAnswer = {
                    _from: this.poll._id,
                    _to: this.$user._id,
                    answerId: option.answerId,
                    pollingEventId: this.$route.params.id
                }
                this.$client.service('answer').create(participantAnswer)
                    .then(() => {
                        this.hasSavedAnswer = true
                    })
                    .catch(this.$showError)
            }
        }
    }
})
</script>
