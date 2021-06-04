<template>
    <div class="h-full w-full bg-white rounded-t-lg relative" :style="`min-height: 75vh`">
        <div class="h-full w-full px-4 md:px-6 py-8" :class="hasSavedAnswer ? 'relative' : 'absolute'">
            <h4 class="font-bold mb-2">{{poll.title}}</h4>
            <p>{{poll.description}}</p>
            <div v-if="!hasSavedAnswer" class="h-full py-10">
                <PollVote :options="poll.answers" @voteConfirmed="submitAnswer"/>
            </div>
            <div v-else class="py-10">
                <PollResults :poll="poll" :key="poll._key"/>
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
            chosenAnswer: {} as Answer,
            hasSavedAnswer: false as boolean
        }
    },
    methods: {
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
                        this.chosenAnswer = option
                        this.hasSavedAnswer = true
                    })
                    .catch(this.$showError)
            }
        }
    }
})
</script>
