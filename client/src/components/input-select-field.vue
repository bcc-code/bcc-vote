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

<script lang="ts">

import ChevronDownIcon from 'heroicons-vue3/solid/ChevronDownIcon'
import { PropType, defineComponent } from 'vue'

type ModelType = number|Array<number>

export default defineComponent({
    components: {
        ChevronDownIcon,
    },
    props: {
        options: Array,
        modelValue: {type: Object as PropType<ModelType>, required: true}
    },
    computed: {
        model: {
            get():ModelType{
                return this.modelValue
            },
            set(val:ModelType):void{
                this.$emit('update:modelValue', val)
            }
        },
        isMultiple():boolean{
            return typeof this.modelValue === 'object'
        }
    },
    emits: ['update:modelValue']
})
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
