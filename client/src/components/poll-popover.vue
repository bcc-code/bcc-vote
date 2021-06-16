<template>
    <div class="h-full w-full bg-white rounded-t-lg relative" :style="`min-height: calc(85vh - 48px);`">
        <div class="h-full w-full p-4 md:p-6">
            <InfoBox v-if="!hasSavedAnswer" class="mb-4">
                {{$t('info.result-visibility.'+poll.resultVisibility)}}
            </InfoBox>
            <div> 
                <h4 class="font-bold" >{{poll.title}}</h4>
                <p v-if="poll.description" class="mt-2">{{poll.description}}</p>
            </div>
            <div v-if="!hasSavedAnswer" class="h-full mb-20 mt-5">
                <PollVote :options="poll.answers" @vote="checkConfirm"/>
            </div>
            <div v-else class="mb-5 mt-2">
                <PollResults :chosenOption="chosenOption.answerId" :poll="poll" :key="poll._key"/>
            </div>
        </div>
        <transition name="fade">
            <div v-if="showConfirm && !hasSavedAnswer">
                <VoteConfirm @cancel="showConfirm = false" @resign="showConfirm = false" @confirm="submitAnswer(chosenOption)">
                    <div class="text-center">
                        <h3 class="font-bold mb-3">{{$t('labels.vote-confirmation')}}</h3>
                        <p class="mb-6">{{chosenOption.explanation}}</p>
                    </div>
                </VoteConfirm>
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
        poll: {type: Object as PropType<Poll>, required: true}
    },
    data() {
        return {
            showConfirm: false as boolean,
            chosenOption: {} as Answer,
            hasSavedAnswer: false as boolean,
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
                            this.chosenOption = {} as Answer;
                            this.hasSavedAnswer = true
                        }
                        this.$showError(err)
                    })
            }
        }
    }
})
</script>