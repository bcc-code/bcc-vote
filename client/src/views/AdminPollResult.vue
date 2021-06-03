<template>
  <div>
    {{poll}}
    {{answers}}
  </div>

</template>

<script lang="ts">
import {defineComponent} from 'vue'
import { Answer } from '../domain';
export default defineComponent({
  data(){
    return{
      poll: {},
      answers: [],
      answerMap: {}
    }
  },
  async created(){
    this.poll = await this.$client.service('poll').get(this.$route.params.id)
    let ind = 0;
    this.poll.answers.forEach((ans: Answer) => {
      this.answerMap[ans.answerId] = ind;
      ind++;
    });
    this.answers = new Array<number>(ind).fill(0);
    const res = await this.$client.service('answer').find({
      query:{
        _from: 'poll/'+this.$route.params.id,
        $select: ['answerId']
      }
    })
    res.forEach((ans: Answer) => {
      this.answers[this.answerMap[ans.answerId]] ++;
    });
    this.$client.service('answer').on('created', this.updateAnswers);
  },
  methods: {
    updateAnswers(ans: Answer){
      console.log('new ans');
      this.answers[this.answerMap[ans.answerId]] ++;
    }
  }
})
</script>