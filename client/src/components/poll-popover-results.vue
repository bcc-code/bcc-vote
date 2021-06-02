<template>
    <div class="h-full w-full px-4 md:px-6 py-8 bg-white rounded-t-lg">
        <div v-for="option in options" :key="option.answerId" class="mb-6">
            <button class="w-full option-button flex">
                <CheckIcon class="text-white" v-if="selectedOption == option"/>
                <h5 class="font-bold text-blue-900">{{option.label}}</h5>
            </button>
            <h6 v-if="selectedOption == option" class="font-bold text-gray-700 mt-2">{{option.explanation}}</h6>
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
    }
})
</script>