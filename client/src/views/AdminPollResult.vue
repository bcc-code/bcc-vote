<template>
  <div>
    {{poll}}
    {{answersSorted}}
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import { Poll, Answer } from '../domain'
export default defineComponent({
    data(){
        return{
            poll: {} as Poll,
            answers: [] as Array<Answer>,
            sortedAnswers: {} as {[answerId: number]: { count:number}}
        }
    },
    async created(){
        await this.loadPoll()
        this.createSortedAnswer()
        await this.loadAnswers()

        this.$client.service('answer').on('created', this.addAnswer)
    },
    methods: {
        async loadPoll(){
            await this.$client.service('poll').get(this.$route.params.id)
                .then((res: Poll) => {
                    this.poll = res
                }).catch(this.$showError)
        },
        createSortedAnswer(){
            this.poll.answers.forEach((answer: Answer) => {
                this.sortedAnswers[answer.answerId] = {
                    count: 0,
                    ...answer
                }
            })
        },
        async loadAnswers(){
            const query = {
                _from: this.poll._id,
                $select: ['answerId']
            }
            await this.$client.service('answer').find(query)
                .then((allAnswers: Answer[])=>{
                    allAnswers.forEach(this.addAnswer)
                })
                .catch(this.$showError)
        },
        addAnswer(answer: Answer){
            this.answers.push(answer)
            this.sortedAnswers[answer.answerId].count ++
        }
    }
})
</script>
