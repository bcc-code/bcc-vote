<template>
    <div class="h-full">
        <div class="text-gray-700 text-xl pb-4">{{$t('info.select-option')}}</div>
        <div v-if="loaded">
            <ProgressBars :sortedOptions="sortedAnswers" :totalCount="totalCount" :chosenOption="chosenOption" v-model="selectedOption"/>
        </div>
        <div class="py-5">
            <div v-if="pollResultsAreVisible">
                <h5 class="font-bold mb-3 text-gray-600">{{$t('labels.participants')}}</h5>
                <VoterList v-if="selectedOption" :voterList="getOnlyOneOption(selectedOption)" :sortedOptions="sortedAnswers" :key="selectedOption"/>
                <VoterList v-else-if="isEventCreator" :voterList="allAnswers" :sortedOptions="sortedAnswers"/>
                <VoterList v-else :voterList="liveAnswers" :sortedOptions="sortedAnswers"/>
            </div>
            <InfoBox v-else>{{$t('info.poll-is.'+poll.resultVisibility)}}</InfoBox>
        </div>
    </div>
</template>
<script lang="ts">
import ProgressBars from '../components/results-progress-bars.vue'
import VoterList from './results-voter-list.vue'

import { Poll, PollResultVisibility, Answer, Option, SortedOptions, PollResult } from '../domain'
import { defineComponent, PropType } from 'vue'
export default defineComponent({
    components: {
        ProgressBars,
        VoterList
    },
    props: {
        poll: {type: Object as PropType<Poll>, required: true},
        chosenOption: {type: Number},
        isEventCreator: {type: Boolean, default: false}
    },
    data() {
        return {
            disapearTime: 5000,
            selectedOption: "",
            loadedAllAnswers: false,
            loaded: false as boolean,
            allAnswers: [] as Array<Answer>,
            liveAnswers: [] as Array<Answer>,
            answerColors: ['#004C78','#006887','#0081A2','#329BBD','#55B6D9','#72D0E3'],
            neutralColor: '#C1C7DA',
            totalCount: 0 as number,
            sortedAnswers: {} as SortedOptions
        }
    },
    async created(){
        await this.init()

        this.$client.service('answer').off('created')
        this.$client.service('poll-result').off('patched')

        this.$client.service('answer').on('created', this.addAnswer)
        this.$client.service('poll-result').on('patched', this.changeBars)

        this.$client.io.on('reconnect', this.init)
    },
    watch: {
        selectedOption(newVal){
            if(newVal && !this.loadedAllAnswers){
                this.loadAllAnswers(this.poll);
            }
        }
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
        async init(){
            this.loaded = false
            this.loadedAllAnswers = false

            this.createSortedAnswer(this.poll)
            let promises = []
            promises.push(this.loadBars(this.poll))
            if(this.selectedOption || this.isEventCreator)
                promises.push(this.loadAllAnswers(this.poll))

            await Promise.all(promises);
            this.loaded = true
        },
        barWidthPercent(opt: Option): number{
            return this.sortedAnswers[opt.answerId].count / this.totalCount * 100;
        },
        isEndRounded(opt: Option): boolean{
            return this.barWidthPercent(opt) > 97;
        },
        getOnlyOneOption(answerId: number){
            return this.allAnswers.filter((v:Answer)=>{
                return v.answerId == answerId
            })
        },
        createSortedAnswer(poll:Poll){
            this.sortedAnswers = {} as SortedOptions
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
        async loadBars(poll:Poll){
            const pollResults = await this.$client.service('poll-result').get(poll._key).catch(this.$showError)
            this.changeBars(pollResults);
        },
        async loadAllAnswers(poll:Poll){
            const res = await this.$client.service('answer').find({
                query: {
                    _from: poll._id
                }
            })
            this.loadedAllAnswers = true;
            this.allAnswers = res;
        },
        addAnswer(answer: Answer){
            if(this.poll && answer._from === this.poll._id) {  
                this.allAnswers.unshift(answer)
                this.liveAnswers.unshift(answer);
                setTimeout(() => {
                    this.liveAnswers.pop();
                }, this.disapearTime)
            }
        },
        changeBars(data: PollResult){
            this.totalCount = 0;
            for(const ans in data.answerCount){
                if(data.answerCount.hasOwnProperty(ans)){
                    this.sortedAnswers[ans].count = data.answerCount[ans];
                    this.totalCount += data.answerCount[ans];
                }
            }
        },
    }

})
</script>
