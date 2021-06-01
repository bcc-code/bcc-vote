<template>
  <div>
    <InfoBox class="mb-8">
      {{$t('info.question-visibility')}}
    </InfoBox>
    <h3 class="font-bold mb-6">{{pollIndex}}. {{$t('labels.poll')}}</h3>
    <FormField v-model="pollData.title" translation = "poll-title" type="string"/>
    <FormField v-model="pollData.description" translation = "poll-description" type="string"/>
    <h3 class="font-bold mb-7">{{$t('labels.answers')}}</h3>
    <InfoBox class="mb-8">
      {{$t('info.answer-explanations')}}
    </InfoBox>
    <div v-for="ind in pollData.answers.length" :key="ind">
      <div class="flex gap-10">
        <FormField v-model="pollData.answers[ind - 1].label" translation="answer-option" :additionalText="ind" type="string" :removable="ind > 2" @remove="removeOption(ind - 1)"/>
        <FormField v-model="pollData.answers[ind - 1].explanation" translation="answer-explanation" :additionalText="`(${$t('labels.option')} ${ind})`" type="string" :removable="ind > 2" @remove="removeOption(ind - 1)" :placeholder="`${$t('fields.if-chosen')} ${pollData.answers[ind - 1].label ? pollData.answers[ind - 1].label: 'this option'}...`"/>
      </div>
    </div>
    <div class="flex items-center text-blue-900 mb-5 font-bold cursor-pointer" @click="addOption">
      <PlusIcon class="w-6 h-6 p-0.5 mr-2"/>
      <h5>{{$t('actions.add-option')}}</h5>
    </div>

    <FormField v-model="pollData.visibility" :value="0" translation="poll-public" type="radio"/>
    <FormField v-model="pollData.visibility" :value="1" translation="poll-non-public" type="radio"/>
    <FormField v-model="pollData.visibility" :value="2" translation="poll-anonymous" type="radio"/>
    <div class="flex justify-center pt-8 pb-4">
      <div class="gradient-button text-lg flex items-center cursor-pointer"  @click="createPoll">
          <PlusIcon class="w-6 h-6 p-0.5 mr-2"/>
          {{$t('actions.add-question')}}
      </div >
    </div>
  </div>
</template>

<script lang="ts">


import InfoBox from '../components/info-box.vue'
import FormField from '../components/form-field.vue'
import PlusIcon from 'heroicons-vue3/outline/PlusIcon'

import { defineComponent } from 'vue'
export default defineComponent({
  components: {
    InfoBox,
    FormField,
    PlusIcon,
  },
  props: {
    pollingEventId: String,
    pollIndex: Number,
  },
  data(){
    return {
      pollData: {
        title: '',
        description: '',
        pollingEventId: this.pollingEventId,
        status: 0,
        visibility: 0,
        answers: [
          {
            label: "Yes",
            explanation: "",
            answerId: 1,
          },
          {
            label: "No",
            explanation: "",
            answerId: 2,
          }
        ]
      }

    }
  },
  methods: {
    addOption(){
      this.pollData.answers.push({
        label: "",
        explanation: "",
        answerId: 2,
      })
    },
    removeOption(ind: number){
      this.pollData.answers.splice(ind, 1);
    },
    createPoll(){
      // this.$client.service('questions').create(this.pollData)
      // .then(() => {
      //   this.$emit('created');
      // })
    }
  },
  emits: ['created']
})
</script>
