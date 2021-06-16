<template>
    <div v-if="loaded" class="h-full">
        <div v-if="pollResultsAreVisible" class="text-gray-700 text-xl pb-4">{{$t('info.select-option')}}</div>
        <div v-if="loaded" class="pt-4">
            <ProgressBars :sortedOptions="sortedOptions" :totalCount="totalCount" :chosenOption="chosenOption" v-model="selectedOption" :visibleResults="pollResultsAreVisible"/>
            <div class="py-5">
            <div v-if="pollResultsAreVisible">
                <h5 class="font-bold mb-3 text-gray-600">{{$t('labels.participants')}}</h5>
                <VoterList :voterList="voterList" :sortedOptions="sortedOptions"/>
            </div>
            <InfoBox v-else>{{$t('info.poll-is.'+poll.resultVisibility)}}</InfoBox>
            </div>
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
        isEventCreator: {type: Boolean, default: false},
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
            sortedOptions: {} as SortedOptions,
            totalCount: 0 as number,
        }
    },
    async created(){
        
        this.$client.service('answer').off('created')
        this.$client.service('poll-result').off('patched')

        await this.init()

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
        voterList():Array<Answer>{
            if(this.selectedOption)
                return this.getOnlyOneOption(this.selectedOption)
            if(this.isEventCreator)
                return this.allAnswers;

            return this.liveAnswers;
        }
    },
    methods: {
        async init(){
            this.loaded = false
            this.loadedAllAnswers = false

            this.generateSortedOptions();

            let promises = []
            promises.push(this.loadBars(this.poll))
            if(this.selectedOption || this.isEventCreator)
                promises.push(this.loadAllAnswers(this.poll))

            await Promise.all(promises);
            this.loaded = true
        },
        barWidthPercent(opt: Option): number{
            return this.sortedOptions[opt.answerId].count / this.totalCount * 100;
        },
        isEndRounded(opt: Option): boolean{
            return this.barWidthPercent(opt) > 97;
        },
        getOnlyOneOption(answerId: string): Array<Answer>{
            return this.allAnswers.filter((v:Answer)=>{
                return v.answerId == answerId
            })
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
                    this.sortedOptions[ans].count = data.answerCount[ans];
                    this.totalCount += data.answerCount[ans];
                }
            }
        },
        generateSortedOptions(){
            this.sortedOptions = {} as SortedOptions
            let colorIndex = 0
            this.poll.answers.forEach((option: Option) => {
                this.sortedOptions[option.answerId] = {
                    count: 0,
                    bgColor: this.answerColors[colorIndex],
                    ...option
                }
                colorIndex++
                if(colorIndex >= this.answerColors.length)
                    colorIndex = 0
            })
            if(this.poll.answers.length > 2) {
                const lastAnswer = this.poll.answers[this.poll.answers.length - 1]
                this.sortedOptions[lastAnswer.answerId].bgColor = this.neutralColor
            }
        }
    }

})
</script>
