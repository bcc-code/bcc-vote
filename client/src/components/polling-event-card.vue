<template>
  <div class="p-4 border-blue rounded-lg">

    <ArrowRight />
  </div>
</template>

<script>
import ArrowRight from 'heroicons-vue3/solid/ArrowNarrowRightIcon'
import { defineComponent } from 'vue'
export default defineComponent({
    components: {
        ArrowRight,
    },
    data() {
        return {
            show: true
        }
    }
})
</script>
<style scoped>
.border-blue {
  border: 1px solid rgba(22, 23, 26, 0.1);
}
</style>