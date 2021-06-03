<template>
    <div class="h-full">
        <div v-if="loaded">
            <div v-for="(option,index) in poll.answers" :key="option.answerId" class="mb-6">
                <div class="result-bar">
                    <span :style="`background-color: ${answerColors[index]}; width: ${sortedAnswers[option.answerId].count / totalCount *100}%`">
                        <h5 class="font-bold text-white">{{option.label}}</h5>
                    </span>
                </div>
            </div>
        </div>
        <div class="py-4">
            <h4 class="font-bold mb-8">{{$t('labels.participants')}}</h4>
            <InfoBox v-if="pollResultsAreHidden">{{$t('info.poll-anonymous')}}</InfoBox>
            <div v-else-if="answers.length">
                <div v-for="answer in answers" :key="answer._key">
                    {{answer._to}}
                </div>
            </div>
            <Spinner v-else />
        </div>
    </div>
</template>
<script lang="ts">
import { Poll, PollResultVisibility, Answer } from '../domain'
import { defineComponent, PropType } from 'vue'
export default defineComponent({
    props: {
        poll: Object as PropType<Poll>
    },
    data() {
        return {
            loaded: false as boolean,
            answerColors: ['#758CDF','#FFA462','#F57988'],
            answers: [] as Array<Answer>,
            totalCount: 0 as number,
            sortedAnswers: {} as {[answerId: number]: { count:number}}
        }
    },
    async created(){
        if(this.poll) {
            this.createSortedAnswer(this.poll)
            await this.loadAnswers(this.poll)
        }
        this.loaded = true
        this.$client.service('answer').on('created', this.addAnswer)
    },
    computed: {
        pollResultsAreHidden() {
            if(this.poll && this.poll.resultVisibility !== PollResultVisibility['Public']) {
                return true
            } else {
                return false
            }
        }
    },
    methods: {
        createSortedAnswer(poll:Poll){
            poll.answers.forEach((answer: Answer) => {
                this.sortedAnswers[answer.answerId] = {
                    count: 0,
                    ...answer
                }
            })
        },
        async loadAnswers(poll:Poll){
            const query = {
                _from: poll._id,
                $select: ['answerId']
            }
            const answers = await this.$client.service('answer').find({query}).catch(this.$showError)
            answers.forEach((a:Answer) => {this.addAnswer(a)})
        },
        addAnswer(answer: Answer){
            this.answers.push(answer)
            this.sortedAnswers[answer.answerId].count ++
            this.totalCount ++
        },
        addcount(){
            this.totalCount ++
        }
    }

})
</script>
<style>
.result-bar {
  box-sizing: content-box;
  position: relative;
  border-width: 1.5px;
  @apply border-gray-200;
  @apply rounded-lg;
  @apply mb-4;
}

.result-bar > span {
  @apply p-4;
  @apply rounded-l-lg;
  display: block;
  height: 100%;
  position: relative;
  overflow: hidden;
  transition: width 2s;
}
.result-bar > span:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1;
  background-size: 50px 50px;
  transition: width 0.3 ease-out;
  overflow: hidden;
}
</style>
