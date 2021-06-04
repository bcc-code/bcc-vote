<template>
    <div class="form-section padding-md">
        <div class="flex justify-between mb-4">
            <h3 class="font-bold">{{isEventLive? $t('labels.poll-queue'): $t('labels.polls')}}</h3>
        </div>
        <InfoBox class="mb-5">{{isEventLive ? $t('info.polls-activation-explaination') : $t('info.polls-will-be-invisible')}}</InfoBox>
        <SavedPoll v-for="(poll, ind) in savedPolls" :key="ind" :poll="poll" :pollIndex="ind + 1" class="mb-6" @edit="startEditing(ind)" @stopEdit="reloadPolls" :active="!currentlyEdited" :editing="currentlyEdited === ind + 1" :isEventLive="isEventLive" @changeStatus="changePollStatus(poll)"/>
        <PollForm v-if="addingPoll" class="mb-5" :eventId="$route.params.id" pollIndex="1" @close="reloadPolls"/>
        <div class="flex justify-center pt-4">
            <div class="gradient-blue lg-button rounded-full text-white font-bold opacity-50 cursor-default"  :class="{'opacity-100 cursor-pointer': !(addingPoll || currentlyEdited)}" @click="createNewPoll">
                {{$t('actions.add-poll')}}
            </div>
        </div>
    </div>  
</template>

<script lang="ts">
import InfoBox from './info-box.vue'
import SavedPoll from './saved-poll.vue'
import PollForm from './poll-form.vue'

import { Poll, PollActiveStatus } from '../domain'

import { defineComponent, PropType } from 'vue'
export default defineComponent({
    props: {
        isEventLive: Boolean,
        savedPolls: { type: Array as PropType<Poll[]>, required: true }
    },
    components: {
        InfoBox,
        SavedPoll,
        PollForm,
    },
    data() {
        return {
            addingPoll: false,
            currentlyEdited: 0,
        }
    },
    methods: {
        async changePollStatus(poll: Poll){
            if(poll.activeStatus === PollActiveStatus["Live"])
                await this.setActivePoll()
            else{
                await this.setActivePoll(poll)
            }
            this.reloadPolls()
        },
        async setActivePoll(poll?: Poll){
            const ind =  this.savedPolls.findIndex((p: Poll) => {
                return p.activeStatus === PollActiveStatus['Live']
            })
            if(ind > -1)
                await this.$client.service('poll').patch(this.savedPolls[ind]._key, {
                    activeStatus: PollActiveStatus['Finished']
                }).catch(this.$showError)
            if(poll)
                await this.$client.service('poll').patch(poll._key, {
                    activeStatus: PollActiveStatus['Live']
                }).catch(this.$showError)
        },
        createNewPoll(){
            if(!this.currentlyEdited){
                this.addingPoll = true
            }
        },
        reloadPolls(){
            this.currentlyEdited = 0
            this.addingPoll = false
            this.$emit('reloadPolls')
        },
        startEditing(ind: number){
            this.currentlyEdited = ind + 1 
            this.addingPoll=false
        },
        
    },
    emits: ['reloadPolls']
})
</script>