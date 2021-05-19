<template>
  <div id = "container">
    <h1>Create your voting here</h1>
    <template-form submitText="create your voting" :sentTemplate="template" @submit="sendToDataBase"></template-form>
  </div>
</template>

<script>

import TemplateForm from "../components/TemplateForm"

import * as services from '../services'
// import TestComp from "../components/TestComp"


export default {
  components: {
   TemplateForm
  },
  props: {
    me: Object
  },
  data (){
    return {
      template: {
        title: '',
        description: '',
        questions: [{
          text: '',
          answers: ['', '']
        }],
        owner: this.me._id
      }
    }
  },
  created(){
    if(!this.me._id)
      this.$router.push('/')
  },
  methods: {
    sendToDataBase(){
      services.templateService.create(this.template)
      .then(() => {
        this.$emit('success', "Template has been saved");
        this.$router.push('/templates');
      })
      .catch(err => {
        this.$emit('error', err.message);
      })
    }
  },
  emits: ['error', 'success']
}
</script>

<style>
  label {
    margin: 10px 0;
    text-align: left;
  }
</style>