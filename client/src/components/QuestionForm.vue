<template>
  <div class = "vertical width-90 go-center color-grey rounded top-space-10 padding-vertical-10">
    <div class="width-100 horizontal space-out center-line">
      <label class="medium-text">Question {{index + 1}}:</label>
      <icon-base class="box-40 clickable" @click="deleteMe"><icon-cross /></icon-base>
    </div>
    <input type="text" placeholder="Question" v-model="template.questions[index].text" @keydown.enter.prevent="focusNext" @keydown.down.prevent="focusNext" @keydown.up.prevent="focusPrev"/>
    <div class="width-100 horizontal space-out center-line">
      <label class="medium-text">Answers</label>
      <numeric-input :min="2" v-model="numberOfAnswers"></numeric-input>
    </div>
    <div v-for="ind in numberOfAnswers" :key="ind" class="width-100 horizontal center-line">
      <input v-model="template.questions[index].answers[ind - 1]" :placeholder="'Answer '+ind"  @keydown.enter.prevent="focusNext" @keydown.down.prevent="focusNext" @keydown.up.prevent="focusPrev" class="width-100"/>
      <icon-base class="box-30 clickable margin-horizontal-10" @click="deleteAns(ind - 1)"><icon-cross /></icon-base>
    </div>
    
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
    index: Number,
    sentTemplate: Object
  },
  data () {
    return {
      template: Object
    }
  },
  created () {
    if(this.sentTemplate)
      this.template = this.sentTemplate;
  },
  computed: {
    numberOfAnswers: {
      get(){
        return this.template.questions[this.index].answers.length;
      },
      set(newVal){
        const diff = newVal - this.template.questions[this.index].answers.length;
        if(diff > 0){
          for(let i =0; i < diff; i++){
            this.template.questions[this.index].answers.push('');
          }
        } 
        else{
          this.template.questions[this.index].answers.splice(newVal, -diff);
        }
      }
    }
  },
  methods: {
    deleteMe(){
      this.template.questions.splice(this.index, 1);
    },
    deleteAns(ind){
      this.template.questions[this.index].answers.splice(ind, 1);
    },
    focusNext(evt){
      focus.focusOnNextFormInput(evt.target);
    },
    focusPrev(evt){
      focus.focusOnPreviousFormInput(evt.target);
    }
  },

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