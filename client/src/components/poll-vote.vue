<template>
    <div class="h-full">
        <div v-for="option in options" :key="option.answerId">
            <button class="w-full option-button flex mb-4" :class="selectedOption == option ? 'border-blue-900' : 'border-gray-200'" @click="selectedOption = option">
                <span class="h-5 w-5 p-1 mr-4 bg-gray-100 rounded-full" :class="selectedOption == option ? 'bg-blue-900' : 'bg-gray-100'">
                    <CheckIcon class="text-white" v-if="selectedOption == option"/>
                </span>
                <h5 class="font-bold text-blue-900">{{option.label}}</h5>
            </button>
        </div>
        <div class="flex justify-center mt-9">
            <button class="vote-button" :class="canVote ? '' : 'button-inactive'" @click="$emit('vote', selectedOption)">
                <h5 class="font-bold text-white">{{$t('actions.vote')}}</h5>
            </button>
        </div>
    </div>
</template>
<script lang="ts">
import CheckIcon from 'heroicons-vue3/solid/CheckIcon';
import { Option } from '../domain/Poll';
import { defineComponent, PropType } from 'vue';
export default defineComponent({
    components: {
        CheckIcon
    },
    props: {
        options: {type: Array as PropType<Array<Option>>, required: true},
        submitting: {type: Boolean, default: false}
    },
    data() {
        return {
            selectedOption: null as null | Option
        };
    },
    computed: {
        canVote():boolean{
            return this.selectedOption !== null && !this.submitting;
        }
    },
    emits: ['vote']
});
</script>
<style>
.option-button {
    border-width: 1.5px;
    @apply rounded-lg;
    @apply p-3;
}
.vote-button {
    @apply w-full;
    @apply rounded-full;
    @apply bg-blue-900;
    @apply py-4;
    max-width: 400px;
}
</style>
