<template>
  <div class="px-4 py-6 bg-white rounded-t-lg">
      <h4 class="font-bold">{{poll.title}}</h4>
      <div class="text-gray-700 mb-3 flex">
          description
      </div>
  </div>
</template>
<script lang="ts">
import { Poll } from '../domain/Poll'
import { defineComponent, PropType } from 'vue'
export default defineComponent({
    props: {
        poll: Object as PropType<Poll>,
    }
})
</script>
