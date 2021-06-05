<template>
    <div class="h-full flex flex-col justify-between">
        <div> 
            <div v-for="option in options" :key="option.answerId" class="mb-6">
                <button class="w-full option-button flex" :class="selectedOption == option ? 'border-blue-900' : 'border-gray-200'" @click="selectedOption = option">
                    <span class="h-5 w-5 p-1 mr-4 bg-gray-100 rounded-full" :class="selectedOption == option ? 'bg-blue-900' : 'bg-gray-100'">
                        <CheckIcon class="text-white" v-if="selectedOption == option"/>
                    </span>
                    <h5 class="font-bold text-blue-900">{{option.label}}</h5>
                </button>
            </div>
        </div>
        <div class="w-full pb-6 flex justify-center">
            <button class="vote-button" :style="selectedOption == null ? 'opacity:0.3' : ''" @click="$emit('vote', selectedOption)">
                <h5 class="font-bold text-white">{{$t('actions.vote')}}</h5>
            </button>
        </div>
    </div>
</template>
<script lang="ts">
import CheckIcon from 'heroicons-vue3/solid/CheckIcon'
import { Option } from '../domain/Poll'
import { defineComponent, PropType } from 'vue'
export default defineComponent({
    components: {
        CheckIcon
    },
    props: {
        options: Array as PropType<Array<Option>>
    },
    data() {
        return {
            selectedOption: null
        }
    },
    emits: ['vote']
})
</script>
<style>
.option-button {
    border-width: 1.5px;
    @apply rounded-lg;
    @apply p-4;
}
.vote-button {
    @apply w-full;
    @apply rounded-full;
    @apply bg-blue-900;
    @apply py-4;
    max-width: 400px;
}
</style>
