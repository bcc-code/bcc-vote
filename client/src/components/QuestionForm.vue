<template>
  <div class = "vertical width-90 go-center color-grey rounded top-space-10 padding-vertical-10">
    
    <input type="text" placeholder="Question" v-model="question.text" @keydown.enter.prevent="focusNext" @keydown.down.prevent="focusNext" @keydown.up.prevent="focusPrev"/>
    <div class="horizontal center-line">
      <input type="checkbox" :value="true" v-model="question.public"/>
      <h3 class="margin-horizontal-10">Public result</h3>
    </div>
    <div class="horizontal center-line">
      <input type="checkbox" :value="true" v-model="question.isTime"/>
      <h3 class="margin-horizontal-10">Time limit (seconds)</h3>
      <numeric-input v-if="question.isTime" v-model="question.timeLimit"/>
    </div>
    <div class="width-100 horizontal space-out center-line">
      <label class="medium-text">Answers</label>
      <numeric-input :min="2" v-model="numberOfAnswers"></numeric-input>
    </div>
    <div v-for="ind in numberOfAnswers" :key="ind" class="width-100 horizontal center-line">
      <input v-model="question.answers[ind - 1]" :placeholder="'Answer '+ind"  @keydown.enter.prevent="focusNext" @keydown.down.prevent="focusNext" @keydown.up.prevent="focusPrev" class="width-100"/>
      <icon-base class="box-30 clickable margin-horizontal-10" @click="deleteAns(ind - 1)"><icon-cross /></icon-base>
    </div>
    <input @click="$emit('postQuestion')" type="submit" value="Post"/>
  </div>
</template>
<script>

import IconBase from '../components/IconBase'
import IconCross from '../components/icons/IconCross'
import NumericInput from './NumericInput.vue'
import focus from '../util/functions.js'

export default {
  components: {
    NumericInput,
    IconBase,
    IconCross,
  },
  props: {
    sentQuestion: Object
  },
  data () {
    return {
      question: Object,
    }
  },
  created () {
    if(this.sentQuestion)
      this.question = this.sentQuestion;
  },
  computed: {
    numberOfAnswers: {
      get(){
        return this.question.answers.length;
      },
      set(newVal){
        const diff = newVal - this.question.answers.length;
        if(diff > 0){
          for(let i =0; i < diff; i++){
            this.question.answers.push('');
          }
        } 
        else{
          this.question.answers.splice(newVal, -diff);
        }
      }
    }
  },
  methods: {
    deleteMe(){
      this.question.splice(this.index, 1);
    },
    deleteAns(ind){
      this.question.answers.splice(ind, 1);
    },
    focusNext(evt){
      focus.focusOnNextFormInput(evt.target);
    },
    focusPrev(evt){
      focus.focusOnPreviousFormInput(evt.target);
    }
  },
  emits: ['postQuestion'],

}
</script>

<style scoped>
.question{
    background-color: #999;
    width: 80%;
    padding: 10px 10%;
    margin: 5px;
    border-radius: 20px;
    align-self: center;
  }
  label{
    align-self: left;
  }
</style>