<template>
  <div v-if="!editing" class="py-8 px-5 border-2 border-with-bar" :class="{'opacity-50 cursor-default': !active, 'blue-border': isLive, 'bg-gray-100 text-gray-800': isFinished}">
    <div class="flex justify-between mb-1">
      <h3 class="font-bold">{{pollIndex}}. {{poll.title}}</h3>
      <PencilIcon v-if="isNotStarted" class="w-10 h-10 p-2 text-blue-900" :class="{'cursor-pointer': active}" @click="startEditing"/>
    </div>
    <div v-if="poll.description" class="text-xl mb-8">{{poll.description}}</div>
    <div v-if="isNotStarted" class="flex items-center text-red-500 mt-4" :class="{'cursor-pointer': active}" @click="deletePoll">
      <TrashIcon class="w-5 h-5 mr-2"/>
      <div class="text-xl font-bold">{{$t('actions.delete-poll')}}</div>
    </div>
    <slot>
    </slot>
  </div>
  <PollForm v-else :eventId="$route.params.id" :poll="poll" :pollIndex="pollIndex" @close="stopEditing" @delete="deletePoll"/>
</template>
<script lang="ts">

import PencilIcon from 'heroicons-vue3/outline/PencilIcon'
import TrashIcon from 'heroicons-vue3/outline/TrashIcon'
import PollForm from '../components/poll-form.vue'
import { Poll, PollActiveStatus } from '../domain/Poll'

import { defineComponent, PropType } from 'vue'

export default defineComponent({
    components: {
        PencilIcon,
        TrashIcon,
        PollForm,
    },
    props: {
        poll: {type: Object as PropType<Poll>, required: true},
        pollIndex: Number,
        active: Boolean,
        editing: Boolean,
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
            if(this.active){
        
                this.$emit('edit')
            }
        },
        stopEditing(){
            this.$emit('stopEdit')
        },
        async deletePoll(){
            if(this.active){
                await this.$client.service('poll').remove(this.poll?._key).catch(this.$showError)
                this.$emit('stopEdit')
            }
        }
    },
    emits: ['edit', 'stopEdit']
})
</script>

<style scoped>
  .blue-border{
    border-left-color: #2A4E96;
  }
</style>
