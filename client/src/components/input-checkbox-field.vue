<template>
  <div class="relative w-5 h-5">
    <div v-show="isSet" class="absolute top-0 gradient-blue w-5 h-5 rounded">
      <CheckIcon class="w-5 h-5 text-white absolute top-0"/>
    </div>
    <div class="absolute the-border rounded w-5 h-5"></div>
    <input v-model="model" :value="value" type="checkbox" class="w-5 h-5 opacity-0 cursor-pointer"/>
  </div>
</template>

<script lang="ts">
import CheckIcon from 'heroicons-vue3/solid/CheckIcon'

import { defineComponent, PropType } from 'vue'
export default defineComponent({
    components: {
        CheckIcon
    },
    props: {
        value: { default: true },
        modelValue: {type: Object as PropType<string | boolean>, required: true},
    },
    computed: {
        model: {
            get(): (string|boolean) {
                return this.modelValue
            },
            set(val: (string|boolean)):void {
                if(val)
                    this.$emit('update:modelValue', this.value)
                else if(typeof this.value == "boolean")
                    this.$emit('update:modelValue', !this.value)
            }
        },
        isSet(): boolean {
            return this.value === this.modelValue
        }
    },
    emits: ['update:modelValue']
})
</script>

<style scoped>
  .the-border {
    border: 2px solid rgba(19, 40, 54, 0.1);
  }
</style>
