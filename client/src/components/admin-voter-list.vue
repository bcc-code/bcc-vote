<template>
    <div>
        <transition-group name="list" tag="div" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div v-for="answer in voterList" :key="answer._id">
                <div class="answer-box">
                    <div class="p-2">
                        <h4 class="font-bold">{{answer.displayName}}</h4>
                    </div>
                    <div class="flex items-center px-4 rounded-r-lg" :style="`background-color:${sortedOptions[answer.answerId].bgColor};`">
                        <h4 class="font-bold text-white">{{sortedOptions[answer.answerId].label}}</h4>
                    </div>
                </div>
            </div>
        </transition-group>
        
        <Spinner inline v-if="voterList.length === 0"/>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Answer, SortedOptions } from '../domain'

export default defineComponent({
    props: {
        voterList: {type: Array as PropType<Array<Answer>>, required: true},
        sortedOptions: {type: Object as PropType<SortedOptions>, required: true},
    }
})
</script>
<style scoped>
.answer-box {
    @apply flex;
    @apply justify-between;
    border-width: 1.5px;
    border-style: solid;
    @apply border-gray-500;
    @apply rounded-lg;
}
</style>