<template>
  <div class = "vertical width-90 go-center color-grey rounded top-space-10 padding-vertical-10">
    <question-data :data="data" @timeOut="$emit('timeOut')"/>
    <h3 v-if="data.savedAnswer">Saved answer: {{data.answers[data.savedAnswer - 1]}}</h3>
    <div v-for="ind in data.answers.length" :key="ind" class="width-100 horizontal center-line">
        <input type="radio" v-model="selected" :value="ind"/>
        <h3>&nbsp;{{data.answers[ind - 1]}}</h3>
    </div>
    <input type="submit" value="send" @click="$emit('answer', selected)"/>
  </div>
</template>

<script>

import QuestionData from './QuestionData'

export default {
    components: { 
        QuestionData,
    },
    props: {
        data: Object,
    },
    data () {
        return {
            selected: ''
        }
    },
    emits: ['answer', 'timeOut']
}
</script>
