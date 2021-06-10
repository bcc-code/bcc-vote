<template>
    <div class="h-full">
        <div v-if="loaded">
            <div  v-for="option in poll.answers" :key="option" class="result-bar mb-2">
                <div class="absolute py-3 top-0">
                    <h5 class="font-bold ml-12" :style="`color: ${sortedAnswers[option.answerId].bgColor}; white-space: nowrap;`">
                        {{option.label}}</h5>
                </div>
                <span :style="[`background-color: ${sortedAnswers[option.answerId].bgColor};`,`width: ${totalCount === 0 ? 0 : sortedAnswers[option.answerId].count / totalCount * 100}%;`]"
                    :class="sortedAnswers[option.answerId].count == totalCount ? 'rounded-lg' : 'rounded-l-lg'">
                    <h5 class="font-bold text-white whitespace-nowrap overflow-hidden ml-12" style="white-space: nowrap;">{{option.label}}</h5>
                </span>
                <div class="absolute top-0 flex flex-row-reverse justify-between w-full p-3">
                    <h5 class="font-bold text-gray-600">
                        {{sortedAnswers[option.answerId].count}} {{sortedAnswers[option.answerId].count === 1? $t('labels.vote'): $t('labels.votes')}}
                    </h5>
                    
                    <span v-if="chosenOption === option.answerId" class="h-5 w-5 p-1 border border-dark-100 mr-4 bg-dark-100 rounded-full">
                        <CheckIcon class="text-white"/>
                    </span>
                </div>
            </div>
        </div>
        <div class="py-5">
            <div v-if="pollResultsAreVisible">
                <h5 class="font-bold mb-3 text-gray-600">{{$t('labels.participants')}}</h5>
                <transition-group name="list" tag="div">
                    <div v-for="(answer,index) in answers" :key="answer._key">
                        <div class="py-3 flex justify-between items-center border-gray-200"
                            :class="index === 0 ? '' : 'border-t-half'">
                            <div>
                                <h4 class="font-bold">{{answer.displayName}}</h4>
                            </div>
                            <div
                                :style="`background-color: ${sortedAnswers[answer.answerId].bgColor};`"
                                :class="['px-6 py-0.5 mr-1 rounded-lg text-white']">
                                <h5 class="font-bold">{{sortedAnswers[answer.answerId].label}}</h5>
                            </div>
                        </div>
                    </div>
                </transition-group>
                <Spinner v-if="answers.length === 0" inline/>
            </div>
            <InfoBox v-else>{{$t('info.poll-is.'+poll.resultVisibility)}}</InfoBox>
        </div>
    </div>
</template>
<script lang="ts">
import CheckIcon from 'heroicons-vue3/solid/CheckIcon'
import { Poll, PollResultVisibility, Answer, Option } from '../domain'
import { defineComponent, PropType } from 'vue'
export default defineComponent({
    components: {
        CheckIcon
    },
    props: {
        poll: {type: Object as PropType<Poll>, required: true},
        chosenOption: {type: Number},
        isEventCreator: {type: Boolean, default: false}
    },
    data() {
        return {
            loaded: false as boolean,
            answerColors: ['#004C78','#006887','#0081A2','#329BBD','#55B6D9','#72D0E3'],
            neutralColor: '#C1C7DA',
            answers: [] as Array<Answer>,
            totalCount: 0 as number,
            sortedAnswers: {} as {[answerId: number]: { count:number, bgColor: string}}
        }
    },
    async created(){
        await this.init()
        this.$client.service('answer').on('created', this.addAnswer)

        this.$client.io.on('reconnect', this.init)
    },
    computed: {
        pollResultsAreVisible():boolean {
            
            if(this.poll.resultVisibility === PollResultVisibility['Public'])
                return true
            if(this.poll.resultVisibility === PollResultVisibility['Anonymous'])
                return false
            if(this.isEventCreator)
                return true
                 
            return false
        }
    },
    methods: {
        createSortedAnswer(poll:Poll){
            let colorIndex = 0
            poll.answers.forEach((option: Option) => {
                this.sortedAnswers[option.answerId] = {
                    count: 0,
                    bgColor: this.answerColors[colorIndex],
                    ...option
                }
                colorIndex++
                if(colorIndex >= this.answerColors.length)
                    colorIndex = 0;
            })
            const lastAnswer = poll.answers[poll.answers.length - 1]
            this.sortedAnswers[lastAnswer.answerId].bgColor = this.neutralColor;
        },
        async loadAnswers(poll:Poll){
            const query = {
                _from: poll._id
            }
            const answers = await this.$client.service('answer').find({query}).catch(this.$showError)
            answers.forEach((a:Answer) => {this.addAnswer(a)})
        },
        addAnswer(answer: Answer){
            if(this.poll && answer._from === this.poll._id) {  
                this.answers.unshift(answer)
                this.sortedAnswers[answer.answerId].count ++
                this.totalCount ++
            }
        },
        async init(){
            this.loaded = false
            this.answers =  []
            this.totalCount = 0
            if(this.poll){
                this.sortedAnswers = {} as {[answerId: number]: { count:number, bgColor: string}}
                this.createSortedAnswer(this.poll)
                await this.loadAnswers(this.poll)
                this.loaded = true
            }
            
        },
    }

})
</script>
<style>
.result-bar {
  box-sizing: content-box;
  position: relative;
  border-width: 1.5px;
  @apply rounded-lg;
}

.result-bar > span {
  @apply py-3;
  display: block;
  height: 100%;
  position: relative;
  overflow: hidden;
  transition: width 2s;
}
</style>
