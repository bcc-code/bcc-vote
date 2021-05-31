<template>
  <div v-if="show" class="p-4 border-blue rounded-lg bg-blue-300 flex">
    <div class="info-icon flex-shrink-0 text-blue-800 h-4 w-4 m-1 mt-1"/>
    <label class="flex-grow text-blue-800 px-2">
      <slot>
      </slot>
    </label>
    <XIcon class="text-blue-800 flex-shrink-0 h-6 w-6 p-1 cursor-pointer" @click="show = false"/>
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
<style scoped>
.border-blue {
  border: 1px solid rgba(22, 23, 26, 0.1);
}
</style>