<template>
  <form v-if="ready" @submit.prevent="$emit('submit')" class="width-100 vertical">
    <label class="big-text">Title:</label>
    <input name="title" type="text" placeholder="title" v-model="template.title" @keydown.enter.prevent="focusNext" @keydown.down="focusNext"/>
    <label class="big-text">Description:</label>
    <textarea name="title" type="textarea" placeholder="description" v-model="template.description" @keydown.ctrl.enter.prevent="focusNext" @keydown.down.prevent="focusNext" @keydown.up.prevent="focusPrev"/>
    <div class="width-100 horizontal space-out center-line">
      <label class="big-text">Questions:</label>
      <numeric-input :min="0" v-model="numberOfQuestions"></numeric-input>
    </div>
    <question-form v-for="n in numberOfQuestions" :key="n" :index="n - 1" :sentTemplate="template"></question-form>
    <input type="submit" class="unselectable" :value="submitText" @keydown.up.prevent="focusPrev" @keydown.down.prevent/>
    
  </form>
</template>

<script>

import NumericInput from "./NumericInput"
import QuestionForm from "./QuestionForm"

import focus from "../util/functions.js"

import functions from "../util/functions.js"


export default {
  components: {
    NumericInput,
    QuestionForm,
  },
  props:{
    sentTemplate: Object,
    submitText: String,
  },
  data () {
    return {
      template: Object,
      ready: false,
    }
  },
  mounted() {
    if(this.sentTemplate){
      this.template = this.sentTemplate
      this.ready = true;
    }
  },
  computed: {
    numberOfQuestions: {
      get () {
        return this.template.questions.length;
      },
      set(val) {
        const diff = val - this.template.questions.length;
        if(diff > 0){
          functions.repeat(diff, this.addQuestion);
        }
        else{
          this.template.questions.splice(val, -diff);
        }
      }
    }
  },
  methods: {
    addQuestion(){
      this.template.questions.push({
        text: '',
        answers: ['','']
      })
    },
    changeTemplate(){
      this.template.title="cool title";
    },
    focusNext(evt){
      focus.focusOnNextFormInput(evt.target);
    },
    focusPrev(evt){
      focus.focusOnPreviousFormInput(evt.target);
    }
  },
  emits: ['submit']
}
</script>