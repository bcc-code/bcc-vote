<template>
  <div class="relative w-5 h-5">
    <div v-show="isSet" class="absolute top-0 gradient-blue w-5 h-5 rounded-full">
        <div class="w-2 h-2 m-1.5 rounded-full bg-white"></div>
    </div>
    <div class="absolute the-border rounded-full w-5 h-5"></div>
    <input v-model="model" :value="value" type="checkbox" class="w-5 h-5 opacity-0 cursor-pointer"/>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
export default defineComponent({
    props: {
        value: { default: true },
        modelValue: {type: [String, Boolean] as PropType<string | boolean>, required: true}
    },
    computed: {
        model: {
            get(): (string | boolean) {
                return this.modelValue
            },
            set(val: (string | boolean)):void {
                if(val)
                    this.$emit('update:modelValue', this.value)
                else if(typeof this.value == "boolean")
                    this.$emit('update:modelValue', !this.value)
            }
        },
        isSet():boolean {
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
