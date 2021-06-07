<template>
    <div class="h-full">
        <div v-if="loaded">
            <div v-for="(option,index) in poll.answers" :key="option.answerId">
                <div class="result-bar mb-6">
                    <div class="absolute py-4 top-0">
                        <h5 class="font-bold ml-12" :style="`color: ${answerColors[index]}; white-space: nowrap;`">{{option.label}} ({{sortedAnswers[option.answerId].count}})</h5>
                    </div>
                    <span :style="[`background-color: ${answerColors[index]};`,`width: ${totalCount === 0 ? 0 : sortedAnswers[option.answerId].count / totalCount * 100}%;`]"
                        :class="sortedAnswers[option.answerId].count == totalCount ? 'rounded-lg' : 'rounded-l-lg'">
                        <h5 class="font-bold text-white whitespace-nowrap overflow-hidden ml-12" style="white-space: nowrap;">{{option.label}} ({{sortedAnswers[option.answerId].count}})</h5>
                    </span>
                </div>
            </div>
        </div>
        <div class="py-4">
            <h4 class="font-bold mb-8">{{$t('labels.participants')}}</h4>
            <InfoBox v-if="pollResultsAreHidden">{{$t('info.poll-anonymous')}}</InfoBox>
            <div v-else-if="answers.length">
                <div v-for="(answer,index) in answers" :key="answer._key">
                    <div class="py-2 flex justify-between items-center border-gray-200" 
                        :class="index + 1 === answers.length ? '' : 'border-b-half'">
                        <div>
                            <h4 class="font-bold">{{answer.displayName}}</h4>    
                            <label class=" text-gray-700">{{answer.churchName}}</label>    
                        </div>
                        <div
                            :style="`background-color: ${sortedAnswers[answer.answerId].bgColor};`" 
                            :class="['px-6 py-1 mr-1 rounded-lg text-white']">
                            <h4 class="font-bold">{{sortedAnswers[answer.answerId].label}}</h4>
                        </div>
                    </div>
                </div>
            </div>
            <Spinner inline v-else />
        </div>
    </div>
</template>
<script lang="ts">
import { Poll, PollResultVisibility, Answer, Option } from '../domain'
import { defineComponent, PropType } from 'vue'
export default defineComponent({
    props: {
        poll: Object as PropType<Poll>
    },
    data() {
        return {
            loaded: false as boolean,
            answerColors: ['#758CDF','#FFA462','#F57988','#FFEB3B','#009688','#009688'],
            answers: [] as Array<Answer>,
            totalCount: 0 as number,
            sortedAnswers: {} as {[answerId: number]: { count:number, bgColor: string}}
        }
    },
    async created(){
        await this.init()
        this.$client.service('answer').on('created', this.addAnswer)

        this.$client.io.on('reconnect', this.init);
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
            let colorIndex = 0
            poll.answers.forEach((option: Option) => {
                this.sortedAnswers[option.answerId] = {
                    count: 0,
                    bgColor: this.answerColors[colorIndex],
                    ...option
                }
                colorIndex++
            })
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
                this.answers.push(answer)
                this.sortedAnswers[answer.answerId].count ++
                this.totalCount ++
            }
        },
        async init(){
            console.log('initialize');
            this.loaded = false;
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
  @apply py-4;
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
