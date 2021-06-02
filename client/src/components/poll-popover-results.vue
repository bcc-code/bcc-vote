<template>
    <div class="h-full w-full px-4 md:px-6 py-8 bg-white rounded-t-lg">
        <div v-for="(option,index) in options" :key="option.answerId" class="mb-6">
            <div class="w-full result-bar flex" :style="`background: linear-gradient(to right, ${answerColors[index]} ${answerPercent[index]}%, #FFF ${100 - answerPercent[index]}%);`">
                {{answerPercent[index]}}
                <h5 class="font-bold text-white">{{option.label}}</h5>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import CheckIcon from 'heroicons-vue3/solid/CheckIcon'
import { Answer } from '../domain/Poll'
import { defineComponent, PropType } from 'vue'
export default defineComponent({
    components: {
        CheckIcon
    },
    props: {
        options: Array as PropType<Array<Answer>>
    },
    data() {
        return {
            answerColors: ['#758CDF','#FFA462','#F57988'],
            answerPercent: [60,30,10]
        }
    },
})
</script>
<style>
.result-bar {
    border-width: 1.5px;
    @apply border-gray-200;
    @apply rounded-lg;
    @apply p-4;
}
</style>