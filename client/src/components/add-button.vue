<template>
  <div class="flex items-center text-blue-900 font-bold cursor-pointer">
      <PlusIcon class="w-5 h-5 mr-1"/>
      <h5>{{$t(`actions.${translation}`)}}</h5>
    </div>
</template>

<script>

import PlusIcon from 'heroicons-vue3/outline/PlusIcon'
export default {
  components: {
    PlusIcon,
  },
  props: {
    translation: String
  },
}
</script>