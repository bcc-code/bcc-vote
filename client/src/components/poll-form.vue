<template>
  <div class="border-with-bar px-5 py-8">
    <div class="flex justify-between mb-6">
    <h3 class="font-bold">
      {{poll ? pollIndex+'. '+poll.title : $t('labels.new-poll')}}
    </h3>
    <XIcon class="w-8 h-8 p-2 cursor-pointer" @click="$emit('close')"/>
    </div>
    <FormField v-model="pollData.title" translation = "poll-title" type="string"/>
    <FormField v-model="pollData.description" translation = "poll-description" type="string" optional/>
    <h3 class="font-bold mb-7">{{$t('labels.answers')}}</h3>
    <InfoBox class="mb-8">
      {{$t('info.answer-explanations')}}
    </InfoBox>
    <div v-for="ind in pollData.answers.length" :key="ind"  class="flex gap-10">
        <FormField v-model="pollData.answers[ind - 1].label" translation="answer-option" :additionalText="ind" type="string" :removable="ind > 2" @remove="removeOption(ind - 1)"/>
        <FormField v-model="pollData.answers[ind - 1].explanation" translation="answer-explanation" :additionalText="`(${$t('labels.option')} ${ind})`" type="string" :removable="ind > 2" @remove="removeOption(ind - 1)" :placeholder="`${$t('fields.if-chosen')} ${pollData.answers[ind - 1].label ? pollData.answers[ind - 1].label: $t('fields.this-option')}...`"/>
    </div>
    <AddButton class="mb-5" translation="add-option" @click="addOption"/>

    <FormField v-model="pollData.resultVisibility" :value="visibility['Public']" translation="poll-public" type="radio"/>
    <FormField v-model="pollData.resultVisibility" :value="visibility['Non Public']" translation="poll-non-public" type="radio"/>
    <FormField v-model="pollData.resultVisibility" :value="visibility['Anonymous']" translation="poll-anonymous" type="radio"/>
    <div v-if="poll" class="flex items-center text-red-500 cursor-pointer" @click="$emit('delete')">
      <TrashIcon class="w-5 h-5 mr-2"/>
      <div class="text-xl font-bold">{{$t('actions.delete-poll')}}</div>
    </div>
    <div class="flex justify-center pt-8 pb-4 gap-2">
      <h5 class="md-button text-gray-800 font-bold cursor-pointer" @click="$emit('close')">
          {{$t('actions.discard')}}
      </h5>
      <h5 class="gradient-button md-button cursor-pointer" @click="sendPoll">
          {{poll ? $t('actions.change-poll'): $t('actions.save-poll')}}
      </h5>
    </div>
  </div>
</template>

<script lang="ts">


import InfoBox from '../components/info-box.vue'
import FormField from '../components/form-field.vue'
import XIcon from 'heroicons-vue3/outline/XIcon'
import AddButton from '../components/add-button.vue'
import TrashIcon from 'heroicons-vue3/outline/TrashIcon'

import { PollPrepare, PollActiveStatus, PollResultVisibility } from '../domain/Poll'

import { defineComponent } from 'vue'
export default defineComponent({
    components: {
        InfoBox,
        FormField,
        XIcon,
        TrashIcon,
        AddButton,
    },
    props: {
        eventId: String,
        pollIndex: Number,
        poll: Object,
    },
    data(){
        return {
            activeStatus: PollActiveStatus,
            visibility: PollResultVisibility,
            pollData: {
                title: '',
                description: '',
                pollingEventId: this.eventId,
                activeStatus: PollActiveStatus['Not Started'],
                resultVisibility: PollResultVisibility['Public'],
                answers: [
                    {
                        label: "Yes",
                        explanation: "",
                        answerId: new Date().getTime(),
                    },
                    {
                        label: "No",
                        explanation: "",
                        answerId: new Date().getTime() + 1,
                    }
                ]
            } as PollPrepare
        }
    },
    created(){
        if(this.poll)
            this.pollData = JSON.parse(JSON.stringify(this.poll))
    },
    methods: {
        addOption(){
            this.pollData.answers.push({
                label: "",
                explanation: "",
                answerId: new Date().getTime(),
            })
        },
        removeOption(ind: number){
            this.pollData.answers.splice(ind, 1)
        },
        sendPoll(){
            if(this.poll?._key){
                this.$client.service('poll').update(this.poll._key, this.pollData)
                    .then(() => {
                        this.$emit('close')
                    }).catch(this.$showError)
            }
            else{
                this.$client.service('poll').create(this.pollData)
                    .then(() => {
                        this.$emit('close')
                    }).catch(this.$showError)
            } 
        }
    },
    emits: ['close']
})
</script>
