<template>
  <div class="relative w-5 h-5">
    <div v-if="isSet" class="absolute top-0 gradient-blue w-5 h-5 rounded">
      <CheckIcon v-if="isSet" class="w-5 h-5 text-white absolute top-0"/>
    </div>
    <div class="absolute the-border rounded w-5 h-5"></div>
    <input v-model="model" :value="value" type="checkbox" class="w-5 h-5 opacity-0 cursor-pointer"/>
  </div>
</template>

<script>
import CheckIcon from 'heroicons-vue3/solid/CheckIcon'

export default {
  components: {
    CheckIcon
  },
  props: {
    value: { default: true },
    modelValue: String | Boolean,
  },
  computed: {
    model: {
      get() {
        return this.modelValue;
      },
      set(val) {
        console.log(this.value, this.modelValue);
        if(val)
          this.$emit('update:modelValue', this.value)
        else if(typeof this.value == "boolean")
          this.$emit('update:modelValue', !this.value)
      }
    },
    isSet() {
      return this.value === this.modelValue;
    }
  },
  emits: ['update:modelValue']
}
</script>

<style scoped>
  .the-border {
    border: 2px solid rgba(19, 40, 54, 0.1);
  }
</style>