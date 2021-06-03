<template>
    <div class="relative w-full">

        <select v-if="isMultiple" class="box-field appearance-none" v-model="model" multiple>
          <option v-for="(option, ind) in options" :key="ind" :value="option.val">{{option.name}}</option>
        </select>
        <select v-else class="box-field appearance-none" v-model="model">
          <option v-for="(option, ind) in options" :key="ind" :value="option.val">{{option.name}}</option>
        </select>
        <ChevronDownIcon class="w-14 h-10 py-2 px-4 absolute right-0 bottom-0 text-gray-900 pointer-events-none"/>
    </div>
</template>

<script>

import ChevronDownIcon from 'heroicons-vue3/solid/ChevronDownIcon'

export default {
    components: {
        ChevronDownIcon,
    },
    props: {
        options: Array,
        modelValue: Number|Array,
    },
    computed: {
        model: {
            get(){
                return this.modelValue
            },
            set(val){
                this.$emit('update:modelValue', val)
            }
        },
        isMultiple(){
            return typeof this.modelValue == 'object'
        }
    },
    emits: ['update:modelValue']
}
</script>

<style scoped>
  .box-field {
      @apply border-2;
      @apply border-gray-200;
      @apply rounded;

      @apply w-full;
      @apply px-4;
      @apply py-2;
  }

  .box-field:focus {
      @apply outline-none
  }
</style>
