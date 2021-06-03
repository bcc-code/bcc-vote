<template>
  <div>
    {{poll}}
    {{answers}}
  </div>

</template>

<script lang="ts">
import {defineComponent} from 'vue'
import { Poll, Answer } from '../domain';
export default defineComponent({
  data(){
    return{
      poll: {} as Poll,
      answers: [] as Array<number>,

      // this is a map for mapping answerIds to indexes in the list of answers (in python it is called a dictionary and in cpp we call that an unordered_map) in javaScript Object as any can serve this purpose
      answerMap: {} as any
    }
  },
  async created(){
    await this.loadPoll();
    this.createAnswerMap();
    await this.loadAnswers();

    this.$client.service('answer').on('created', this.updateAnswers);
  },
  methods: {
    async loadPoll(){
      this.$client.service('poll').get(this.$route.params.id)
      .then((res: Poll) => {
        this.poll = res;
      }).catch(this.$showError)
    },
    createAnswerMap(){
      // The way it works is that it maps answerIds to the actual index in the answers array so that later I know where to put the answers 

      let answerIndex = 0;
      this.poll.answers.forEach((ans: Answer) => {
        this.answerMap[ans.answerId.toString()] = answerIndex;
        answerIndex++;
      });
      
      this.answers = new Array<number>(answerIndex).fill(0);
    },
    async loadAnswers(){
      this.$client.service('answer').find({
        query:{
          _from: 'poll/'+this.$route.params.id,
          $select: ['answerId']
        }
      }).then((allAnswers: Answer[])=>{
        allAnswers.forEach((ans: Answer) => {
          this.answers[this.answerMap[ans.answerId.toString()]] ++;
        });
      }).catch(this.$showError)
    },
    updateAnswers(ans: Answer){
      this.answers[this.answerMap[ans.answerId.toString()]] ++;
    }
  }
})
</script>