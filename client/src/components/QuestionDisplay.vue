<template>
  <div class = "vertical width-90 go-center color-grey rounded top-space-10 padding-vertical-10">
    <icon-base v-if="active" class="box-30 clickable margin-horizontal-10" @click="$emit('close')"><icon-cross /></icon-base>
    <question-data :data="data" @timeOut="$emit('timeOut')"/>
    
    <h3>{{data.result}}</h3>
    <div v-for="ind in data.answers.length" :key="ind" class="width-100 horizontal center-line">
      <div class="horizontal space-out width-100">
        <h3>{{data.answers[ind - 1]}}</h3>
        <h3 v-if="typeof data.result[ind - 1] == 'number'">{{data.result[ind - 1]}}</h3>
        <h3 v-else>{{data.result[ind - 1].length}}</h3>
      </div>
    </div>
  </div>
</template>

<script>


import IconBase from './IconBase'
import IconCross from './icons/IconCross'
import QuestionData from './QuestionData'

export default {
    components: { 
        IconBase,
        IconCross,
        QuestionData,
    },
    props: {
        data: Object,
        active: Boolean,
    },
    emits: ['close', 'timeOut'],
}
</script>
