<template>
    <div>
        <transition-group name="list" tag="div">
            <div v-for="(answer,index) in voterList" :key="answer._key" class="h-10 flex justify-between items-center border-gray-500" :class="index === 0 ? '' : 'border-t-half'">
                <div>
                    <h4 class="font-bold">{{answer.displayName}}</h4>
                </div>
                <div
                    :style="`background-color: ${sortedOptions[answer.answerId].bgColor};`"
                    :class="['px-6 py-0.5 mr-1 rounded-lg text-white']">
                    <h5 class="font-bold">{{sortedOptions[answer.answerId].label}}</h5>
                </div>
            </div>
        </transition-group>
        <Spinner v-if="voterList.length === 0" inline/>
    </div>
</template>
<script lang="ts">
import { Answer, SortedOptions } from '../domain'
import { defineComponent, PropType } from 'vue'
export default defineComponent({
    props: {
        voterList: {type: Array as PropType<Array<Answer>>, required: true},
        sortedOptions: {type: Object as PropType<SortedOptions>, required: true},
    },
    data(){
        return {
            selectedOption: undefined as undefined|number,
        }
    },
})
</script>