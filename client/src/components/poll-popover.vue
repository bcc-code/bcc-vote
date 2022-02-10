<template>
    <div class="h-full w-full bg-white rounded-t-lg relative" :style="'min-height: calc(100vh - 124px);'">
        <div class="h-full w-full p-4 md:p-6">
            <InfoBox v-if="!answer" class="mb-4">
                {{$t('info.result-visibility.'+poll.resultVisibility)}}
            </InfoBox>
            <div> 
                <h4 class="font-bold" >{{poll.title}}</h4>
                <p v-if="poll.description" class="mt-2 whitespace-pre-wrap">{{poll.description}}</p>
            </div>
            <div v-if="!answer" class="h-full mb-20 mt-5">
                <PollVote :submitting="submitting" :options="poll.answers" @vote="checkConfirm"/>
            </div>
            <div v-else class="mb-5 mt-2">
                <PollResults :chosenOption="answer.answerId" :poll="poll" :key="poll._key"/>
            </div>
        </div>
        <transition name="fade">
            <div v-if="showConfirm && !answer">
                <VoteConfirm :active="!submitting" @cancel="showConfirm = false" @resign="showConfirm = false" @confirm="submitAnswer()">
                    <template v-slot:header>{{$t('labels.vote-confirmation')}}</template>
                    <template v-slot:description>{{chosenOption.explanation}}</template>
                </VoteConfirm>
            </div>
        </transition>
    </div>
</template>
<script lang="ts">
import PollVote from './poll-vote.vue';
import PollResults from './poll-results.vue';
import VoteConfirm from './confirm-popover.vue';
import { Poll, Answer, Option } from '../domain/Poll';
import { defineComponent, PropType } from 'vue';
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
            chosenOption: {} as Option,
            submitting: false        
        };
    },
    methods: {
        checkConfirm(option: Option) {
            this.chosenOption = option;
            if(this.poll && this.poll.confirmAnswer) { 
                this.showConfirm = true;
            } else {
                this.submitAnswer();
            }
        },
        async submitAnswer() {
            if(!this.chosenOption || !this.poll || !this.$user || this.submitting) return;
            const participantAnswer = {
                _from: this.poll._id,
                _to: this.$user._id,
                visibility: this.poll.resultVisibility,
                answerId: this.chosenOption.answerId,
                pollingEventId: this.$route.params.id
            };
            this.submitting = true;
            try {
                const sentAnswer = await this.$client.service('answer').create(participantAnswer)
                this.$emit('answered', sentAnswer);
            } catch(err) {
                this.$handleError(err);
            }
            this.submitting = false;
        }
    },
    emits: ['answered']
});
</script>
