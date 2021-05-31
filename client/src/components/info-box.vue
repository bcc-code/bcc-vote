<template>
  <div v-if="show" class="py-4 px-2 border border-opacity-10 rounded-lg bg-blue-300 flex">
    <div class="info-icon flex-shrink-0 text-blue-800 h-4 w-4 m-1 mr-2"/>
    <label class="flex-grow text-blue-800">
      <slot>
      </slot>
    </label>
    <XIcon class="text-blue-800 flex-shrink-0 h-6 w-6 p-1 ml-1 cursor-pointer" @click="show = false"/>
  </div>
</template>

<script>
  import XIcon from 'heroicons-vue3/solid/XIcon'
  export default {
    components: {
      XIcon,
    },
    data() {
      return {
        show: true
      }
    }
  }
</script>