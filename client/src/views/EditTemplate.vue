<template>
  <div id = "container">
    <h1>Edit your template</h1>
    <template-form v-if="ready" submitText="Update your template" :sentTemplate="template" @submit="sendToDataBase"></template-form>
  </div>
</template>

<script>

import TemplateForm from "../components/TemplateForm"

import * as services from '../services'
// import TestComp from "../components/TestComp"


export default {
  components: {
    TemplateForm,
  },
  props: {
    me: Object
  },
  data (){
    return {
      template: {
        title: '',
        description: '',
        questions: [],
        owner: this.me._id
      },
      ready: false,
    }
  },
  created(){
    if(!this.me._id)
      this.$router.push('/')
    else{
      services.templateService.get(this.$route.params.id)
      .then(res => {
        this.template = res;
        this.ready = true;
      })
    }
  },
  methods: {
    sendToDataBase(){

      services.templateService.update(this.$route.params.id, this.template)
      .then(() => {
        this.$emit('success', "Template has been updated");
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