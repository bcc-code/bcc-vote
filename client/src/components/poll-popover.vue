<template>
    <div class="h-full w-full bg-white rounded-t-lg relative" :style="'min-height: calc(100vh - 124px);'">
        <div class="h-full w-full p-4 md:p-6">
            <InfoBox v-if="!answer" class="mb-4">
                {{$t('info.result-visibility.'+poll.resultVisibility)}}
            </InfoBox>
            <div> 
                <h4 class="font-bold" >{{poll.title}}</h4>
                <p v-if="poll.description" class="mt-2">{{poll.description}}</p>
            </div>
            <div v-if="!answer" class="h-full mb-20 mt-5">
                <PollVote :options="poll.answers" @vote="checkConfirm"/>
            </div>
            <div v-else class="mb-5 mt-2">
                <PollResults :chosenOption="answer.answerId" :poll="poll" :key="poll._key"/>
            </div>
        </div>
        <transition name="fade">
            <div v-if="showConfirm && !answer">
                <VoteConfirm @cancel="showConfirm = false" @resign="showConfirm = false" @confirm="submitAnswer(chosenOption)">
                    <template v-slot:header>{{$t('labels.vote-confirmation')}}</template>
                    <template v-slot:description>{{chosenOption.explanation}}</template>
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
        poll: {type: Object as PropType<Poll>, required: true},
        answer: {type: Object as PropType<Answer>}
    },
    data() {
        return {
            showConfirm: false as boolean,
            chosenOption: {} as Answer,
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
                    visibility: this.poll.resultVisibility,
                    answerId: option.answerId,
                    pollingEventId: this.$route.params.id
                }
                const sentAnswer = await this.$client.service('answer').create(participantAnswer)
                    .catch(this.$handleError)
                
                this.$emit('answered', sentAnswer);
            }
        }
    },
    emits: ['answered']
})
</script>