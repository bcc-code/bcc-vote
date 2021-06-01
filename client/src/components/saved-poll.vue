<template>
  <div class="py-8 px-5 border-2 border-gray-200 rounded-lg" style="border-left-width: 17px">
    <div class="flex justify-between mb-1">
      <h3 class="font-bold">{{pollIndex}}. {{poll.title}}</h3>
      <PencilIcon class="w-10 h-10 p-2 text-blue-900 cursor-pointer" @click="$emit('edit')"/>
    </div>
    <div class="text-xl mb-8">{{poll.description}}</div>
    <div class="flex items-center text-red-500 cursor-pointer" @click="$emit('delete')">
      <TrashIcon class="w-5 h-5 mr-2"/>
      <div class="text-xl font-bold">Delete this question</div>
    </div>
    <slot>
    </slot>
  </div>

</template>
<script lang="ts">
import PencilIcon from 'heroicons-vue3/outline/PencilIcon'
import TrashIcon from 'heroicons-vue3/outline/TrashIcon'

import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    PencilIcon,
    TrashIcon,
  },
  props: {
    poll: Object,
    pollIndex: Number
  },
  emits: ['edit', 'delete']
})
</script>
