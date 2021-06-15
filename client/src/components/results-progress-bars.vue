<template>
    <div>
        <div v-for="(option, answerId) in sortedOptions" :key="answerId" class="relative mb-2 h-10 dark-ring rounded-lg overflow-hidden" :class="(modelValue && modelValue !== answerId) ? 'opacity-50': ''"  @click="clickOption(answerId)">
            <div class="absolute top-0 w-full bar-flex">
                <h5 :style="`color: ${option.bgColor};`">
                    {{option.label}}
                </h5>
                <h5 v-if="barWidthPercent(option) < 90" class="text-gray-600">{{option.count}} {{option.count === 1? $t('labels.vote'): $t('labels.votes')}}</h5>
            </div>
            <div class="relative h-full overflow-hidden dark-ring rounded-l-lg animation" :style="[`background-color: ${option.bgColor};`,`width: ${barWidthPercent(option)}%;`]" :class="{'rounded-r-lg': isEndRounded(option)}">
                <div class="bar-flex w-full text-white">
                    <h5>{{option.label}}</h5>
                    <h5 v-if="barWidthPercent(option) >= 90">{{option.count}} {{option.count === 1? $t('labels.vote'): $t('labels.votes')}}</h5>
                </div>
            </div>
            <span v-if="chosenOption === answerId" class="absolute top-0 h-5 w-5 p-1 check-icon rounded-full">
                <CheckIcon class="text-white"/>
            </span>
        </div>
    </div>
</template>
<script lang="ts">
import CheckIcon from 'heroicons-vue3/solid/CheckIcon'
import { SortedOptions, SortedOption } from '../domain'
import { defineComponent, PropType } from 'vue'
export default defineComponent({
    components: {
        CheckIcon
    },
    props: {
        sortedOptions: {type: Object as PropType<SortedOptions>, required: true},
        totalCount: {type: Number, required: true},
        chosenOption: {type: Number},
        modelValue: {type: String, required: true},
    },
    methods: {
        barWidthPercent(option:SortedOption):number {
            if(option.count) {
                return option.count / this.totalCount * 100 
            } else {
                return 0
            }
        },
        isEndRounded(option:SortedOption):boolean {
            return this.barWidthPercent(option) > 97
        },
        clickOption(answerId: number):void {
            if(this.modelValue === answerId.toString())
                this.$emit('update:modelValue', "");
            else
                this.$emit('update:modelValue', answerId);
        }
    },
    emits: ['update:modelValue']
})
</script>
<style scoped>
.dark-ring{
    box-shadow: inset 0 0 0 2.5px rgba(0, 0, 0, 0.1);
}
.bar-flex{
    @apply flex;
    @apply justify-between;
    @apply h-full;
    @apply items-center;
    @apply pl-10;
    @apply pr-4;
    @apply font-bold;
}
.animation {
    transition: width 0.5s ease-in-out;
}
.check-icon {
    margin: 10px;
    background-color: rgba(0, 0, 0, 0.1);
    @apply dark-ring
}
</style>
