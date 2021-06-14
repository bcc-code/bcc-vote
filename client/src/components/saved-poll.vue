<template>
    <div>
        <div v-if="!editMode" class="py-6 px-5 border-with-bar" :class="{'opacity-50 cursor-default': inactiveMode, 'border-red': isLive, 'bg-gray-100 text-gray-800': isFinished}">
            <div class="flex justify-between mt-1 mb-2">
                <h5 class="text-blue-900 font-bold">{{$t('labels.vote-type.'+poll.resultVisibility)}}</h5>
                <div v-if="isNotStarted" class="flex gap-4">
                    <ToolTip :translation="$t('info.tooltips.edit')" align="center">
                        <PencilIcon class="w-5 h-5 text-blue-900 cursor-pointer" @click="startEditing"/>
                    </ToolTip>
                    <ToolTip :translation="$t('info.tooltips.delete')" align="center">
                        <TrashIcon class="w-5 h-5 text-red-500 cursor-pointer" @click="deletePoll"/>
                    </ToolTip>
                </div>
            </div>
            <h3 class="font-bold mb-1">{{pollIndex + 1}}. {{poll.title}}</h3>
            <p v-if="poll.description" class="text-gray-700">{{poll.description}}</p>
            <div class="text-gray-700 ml-2 mt-2">
                <p v-for="option in poll.answers" :key="option">
                    &bull;<span class="ml-2">{{option.label}}</span>
                </p>
            </div>

            <div v-if="isEventLive" class='flex justify-end'>
                <ToolTip v-if="isNotStarted" :translation="$t('info.tooltips.publish-poll')" align="right">
                <button class="md-button rounded-full font-bold bg-blue-900 text-white" @click="$emit('changeStatus')">
                    {{$t('actions.publish-poll')}}
                </button>
                </ToolTip>
                <ToolTip v-else-if="isLive" :translation="$t('info.tooltips.close-poll')" align="right">
                <button  class="md-button rounded-full font-bold bg-red-500 text-white" @click="$emit('changeStatus')">
                    {{$t('actions.close-poll')}}
                </button>
                </ToolTip>
                <button v-else class="md-button rounded-full font-bold text-gray-800 border-2 border-gray-800" @click="republishConfirm = true">
                    {{$t('actions.republish-poll')}}
                </button>
            </div>
        </div>
        <PollForm v-else :eventId="$route.params.id" :poll="poll" :pollIndex="pollIndex" @close="stopEditing" @delete="deletePoll"/>
        <transition name="fade">
            <ConfirmPopover v-if="republishConfirm" @resign="republishConfirm = false" @cancel="republishConfirm = false" @confirm="republishPoll" cancelTranslation="discard" confirmTranslation="yes-continue">
                    <h3 class="font-bold mb-6 text-center">{{$t('labels.sure-republish')}}
                    </h3>
                    <p class="text-gray-700 mb-4 text-center">{{$t('info.republish-poll')}}</p>
            </ConfirmPopover>
        </transition>
    </div>
</template>
<script lang="ts">

import PencilIcon from 'heroicons-vue3/outline/PencilIcon'
import TrashIcon from 'heroicons-vue3/outline/TrashIcon'

import PollForm from '../components/poll-form.vue'
import ToolTip from './tooltip.vue'
import ConfirmPopover from './confirm-popover.vue'
import { Poll, PollActiveStatus } from '../domain/Poll'

import { defineComponent, PropType } from 'vue'

export default defineComponent({
    components: {
        PencilIcon,
        TrashIcon,
        PollForm,
        ToolTip,
        ConfirmPopover
    },
    props: {
        poll: {type: Object as PropType<Poll>, required: true},
        pollIndex: Number,
        inactiveMode: Boolean,
        editMode: Boolean,
        isEventLive: Boolean,
    },
    data(){
        return{
            republishConfirm: false
        }
    },
    computed: {
        isNotStarted(): boolean{
            return PollActiveStatus["Not Started"] === this.poll.activeStatus
        },
        isLive(): boolean{
            return PollActiveStatus["Live"] === this.poll.activeStatus
        },
        isFinished(): boolean{
            return PollActiveStatus["Finished"] === this.poll.activeStatus
        }
    },
    methods: {
        startEditing(){
            if(!this.inactiveMode){
                this.$emit('edit')
            }
        },
        stopEditing(){
            this.$emit('stopEdit')
        },
        async deletePoll(){
            if(!this.inactiveMode){
                await this.$client.service('poll').remove(this.poll?._key).catch(this.$showError)
                this.$emit('stopEdit')
            }
        },
        changeStatus(){
            if(this.poll.activeStatus === PollActiveStatus['Finished'])
                this.republishConfirm = true;
            else
                this.$emit('changeStatus')
        },
        republishPoll(){
            this.republishConfirm = false;
            this.$emit('changeStatus')
        }
    },
    emits: ['edit', 'stopEdit', 'changeStatus']
})
</script>

<style scoped>
    .border-red{
         border-left-color: #EB7362;
    }
</style>

