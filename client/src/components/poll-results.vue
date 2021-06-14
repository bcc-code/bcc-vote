<template>
    <div class="h-full">
        <div v-if="loaded">
            <div  v-for="option in poll.answers" :key="option" class="relative mb-2 h-10 dark-ring rounded-lg overflow-hidden">
                <div class="absolute top-0 w-full bar-flex">
                    <h5 :style="`color: ${sortedAnswers[option.answerId].bgColor};`">
                        {{option.label}}
                    </h5>
                    <h5 class="text-gray-600">
                        {{sortedAnswers[option.answerId].count}} {{sortedAnswers[option.answerId].count === 1? $t('labels.vote'): $t('labels.votes')}}
                    </h5>
                </div>
                <div class="relative h-full overflow-hidden dark-ring rounded-l-lg animation" :style="[`background-color: ${sortedAnswers[option.answerId].bgColor};`,`width: ${barWidthPercent(option)}%;`]" :class="{'rounded-r-lg': isEndRounded(option)}">
                    <div class="bar-flex calc-width text-white">
                        <h5>{{option.label}}</h5>
                        <h5>
                            {{sortedAnswers[option.answerId].count}} {{sortedAnswers[option.answerId].count === 1? $t('labels.vote'): $t('labels.votes')}}
                        </h5>
                    </div>
                </div>
                <span v-if="chosenOption === option.answerId" class="absolute top-0 h-5 w-5 p-1 check-icon rounded-full">
                    <CheckIcon class="text-white"/>
                </span>
            </div>
        </div>
        <div class="py-5">
            <div v-if="pollResultsAreVisible">
                <h5 class="font-bold mb-3 text-gray-600">{{$t('labels.participants')}}</h5>
                <transition-group name="list" tag="div">
                    <div v-for="(answer,index) in answers" :key="answer._key">
                        <div class="py-2 flex justify-between items-center border-gray-500"
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
        
        this.$client.io.off('reconnect')
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
        },
    },
    methods: {
        barWidthPercent(opt: Option): number{
            return this.sortedAnswers[opt.answerId].count / this.totalCount * 100;
        },
        isEndRounded(opt: Option): boolean{
            return this.barWidthPercent(opt) > 97;
        },
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
<style scoped>
.dark-ring{
    box-shadow: inset 0 0 0 2.5px rgba(0, 0, 0, 0.1);
}
.calc-width {
    width: calc(100vw - 32px)
}

@media screen and (min-width: 768px){
    .calc-width {
        width: 720px;
    }
}
.bar-flex{
    @apply flex;
    @apply justify-between;
    @apply h-full;
    @apply items-center;
    @apply pl-10;
    @apply pr-4;
    @apply font-bold;
}
.animation {
    transition: width 0.5s ease-in-out
}
.check-icon {
    margin: 10px;
    background-color: rgba(0, 0, 0, 0.1);
    @apply dark-ring
}
</style>
