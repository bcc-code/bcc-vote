<template>
    <div class="h-full">
        <div v-if="loaded">
            <ProgressBars :sortedOptions="sortedAnswers" :totalCount="totalCount" :chosenOption="chosenOption"/>
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
import ProgressBars from '../components/results-progress-bars.vue'
import { Poll, PollResultVisibility, Answer, Option, SortedOptions } from '../domain'
import { defineComponent, PropType } from 'vue'
export default defineComponent({
    components: {
        ProgressBars
    },
    props: {
        poll: {type: Object as PropType<Poll>, required: true},
        chosenOption: {type: Number},
        isEventCreator: {type: Boolean, default: false}
    },
    data() {
        return {
            loaded: false as boolean,
            answers: [] as Array<Answer>,
            answerColors: ['#004C78','#006887','#0081A2','#329BBD','#55B6D9','#72D0E3'],
            neutralColor: '#C1C7DA',
            totalCount: 0 as number,
            sortedAnswers: {} as SortedOptions
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
        },
    },
    methods: {
        async loadAnswers(poll:Poll){
            const query = {
                _from: poll._id
            }
            const answers = await this.$client.service('answer').find({query}).catch(this.$showError)
            answers.forEach((a:Answer) => {this.addAnswer(a)})
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
                    colorIndex = 0
            })
            if(poll.answers.length > 2) {
                const lastAnswer = poll.answers[poll.answers.length - 1]
                this.sortedAnswers[lastAnswer.answerId].bgColor = this.neutralColor
            }
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
            if(this.poll){
                this.sortedAnswers = {} as SortedOptions
                this.createSortedAnswer(this.poll)
                await this.loadAnswers(this.poll)
                this.loaded = true
            }
            
        },
    }

})
</script>
