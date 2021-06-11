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
        <h3 class="font-bold">{{$t('labels.answers')}}</h3>
        <p class="mb-7">{{$t('info.answer-explanations')}}</p>
        <FormField v-model="pollData.confirmAnswer" class="mb-8" translation="confirmation" type="checkbox"/>
        <div v-for="(answer, index) in pollData.answers" :key="index"  class="flex gap-10">
            <FormField v-model="pollData.answers[index].label" translation="answer-option" :additionalText="index + 1" type="string" :removable="index > 1" @remove="removeOption(index)"/>
            <FormField v-if="pollData.confirmAnswer" v-model="pollData.answers[index].explanation" translation="answer-confirmation" :additionalText="`(${$t('labels.option')} ${index + 1})`" type="string" :removable="index > 1" @remove="removeOption(index)"/>
        </div>
        <AddButton class="mb-8" translation="add-option" @click="addOption"/>
        <h3 class="font-bold mb-1">{{$t('labels.result-visibility')}}</h3>
        <p class="mb-6">{{$t('info.names-available-for')}}</p>
        <ToolTip :translation="$t('info.tooltips.poll-public')">
            <FormField v-model="pollData.resultVisibility" :value="visibility['Public']" translation="poll-public" type="radio" />
        </ToolTip>
        <ToolTip :translation="$t('info.tooltips.poll-non-public')">
            <FormField v-model="pollData.resultVisibility" :value="visibility['Non Public']" translation="poll-non-public" type="radio"/>
        </ToolTip>
        <ToolTip :translation="$t('info.tooltips.poll-anonymous')">
            <FormField v-model="pollData.resultVisibility" :value="visibility['Anonymous']" translation="poll-anonymous" type="radio"/>
        </ToolTip>
        <div v-if="poll" class="flex items-center text-red-500 cursor-pointer mt-10" @click="$emit('delete')">
            <TrashIcon class="w-5 h-5 mr-2"/>
            <div class="text-xl font-bold">{{$t('actions.delete-poll')}}</div>
        </div>
        <div class="flex justify-center pt-8 pb-4 gap-2">
            <h5 class="md-button text-gray-800 font-bold cursor-pointer" @click="$emit('close')">
                {{$t('actions.discard')}}
            </h5>
            <h5 class="primary-button md-button cursor-pointer" @click="sendPoll">
                {{poll ? $t('actions.change-poll'): $t('actions.save-poll')}}
            </h5>
        </div>
    </div>
</template>
<script lang="ts">
import ToolTip from '../components/tooltip.vue'
import FormField from '../components/form-field.vue'
import XIcon from 'heroicons-vue3/outline/XIcon'
import AddButton from '../components/add-button.vue'
import TrashIcon from 'heroicons-vue3/outline/TrashIcon'
import { PollPrepare, PollActiveStatus, PollResultVisibility } from '../domain/Poll'
import { defineComponent } from 'vue'
export default defineComponent({
    components: {
        ToolTip,
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
                confirmAnswer: true,
                answers: [
                    {
                        label: this.$t('labels.yes'),
                        explanation: this.$t('explanations.agree'),
                        answerId: new Date().getTime(),
                    },
                    {
                        label: this.$t('labels.no'),
                        explanation: this.$t('explanations.disagree'),
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
