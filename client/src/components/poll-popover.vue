<template>
    <div class="h-full w-full bg-white rounded-t-lg relative" :style="`min-height: calc(85vh - 96px);`">
        <div class="h-full w-full px-4 md:px-6 p-8">
            <InfoBox class="mb-9">
                {{$t('info.result-visibility.'+poll.resultVisibility)}}
            </InfoBox>
            <h4 class="font-bold mb-2">{{poll.title}}</h4>
            <p>{{poll.description}}</p>
            <div v-if="!hasSavedAnswer" class="h-full pt-10 pb-20">
                <PollVote :options="poll.answers" @vote="checkConfirm"/>
            </div>
            <div v-else class="py-10">
                <PollResults :poll="poll" :key="poll._key"/>
            </div>
        </div>
        <transition name="fade">
            <div v-if="showConfirm && !hasSavedAnswer">
                <VoteConfirm :chosenOption="chosenOption" @cancel="showConfirm = false" @confirm="submitAnswer(chosenOption)"/>
            </div>
        </transition>
    </div>
</template>
<script lang="ts">
import PollVote from './poll-vote.vue'
import PollResults from './poll-results.vue'
import VoteConfirm from './confirm-popover.vue'
import { Poll, Answer } from '../domain/Poll'
import { defineComponent, PropType } from 'vue'
export default defineComponent({
    components: {
        PollVote,
        PollResults,
        VoteConfirm
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
            if(this.poll && this.poll.confirmAnswer) { 
                this.showConfirm = true
            } else {
                this.submitAnswer(option)
            }
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
                    .catch((err:Error) => {
                        if(err.message.includes('You cannot vote 2 times')) {
                            this.hasSavedAnswer = true
                        }
                        this.$showError(err)
                    })
            }
        }
    }
})
</script>