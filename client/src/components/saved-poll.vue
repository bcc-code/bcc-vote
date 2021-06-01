<template>
  <div v-if="!isEdit" class="py-8 px-5 border-2 border-with-bar" :class="{'opacity-50 cursor-default': !active}">
    <div class="flex justify-between mb-1">
      <h3 class="font-bold">{{pollIndex}}. {{poll.title}}</h3>
      <PencilIcon class="w-10 h-10 p-2 text-blue-900" :class="{'cursor-pointer': active}" @click="startEditing"/>
    </div>
    <div class="text-xl mb-8">{{poll.description}}</div>
    <div class="flex items-center text-red-500" :class="{'cursor-pointer': active}" @click="deletePoll">
      <TrashIcon class="w-5 h-5 mr-2"/>
      <div class="text-xl font-bold">{{$t('actions.delete-poll')}}</div>
    </div>
  </div>
  <PollForm v-else :eventId="$route.params.id" :poll="poll" :pollIndex="pollIndex" isEdit @close="stopEditing" @delete="deletePoll"/>
</template>
<script lang="ts">
import PencilIcon from 'heroicons-vue3/outline/PencilIcon'
import TrashIcon from 'heroicons-vue3/outline/TrashIcon'
import PollForm from '../components/poll-form.vue'

import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    PencilIcon,
    TrashIcon,
    PollForm,
  },
  props: {
    poll: {type: Object, required: true},
    pollIndex: Number,
    active: Boolean,
  },
  data(){
    return {
      isEdit: false,
    }
  },
  methods: {
    startEditing(){
      if(this.active){
        
        this.$emit('edit');
        this.isEdit = true;
      }
    },
    stopEditing(){
      this.$emit('stopEdit');
      this.isEdit = false;
    },
    deletePoll(){
      if(this.active)
        this.$client.service('poll').remove(this.poll?._key)
    }
  },
  emits: ['edit', 'stopEdit']
})
</script>
