<template>
  <div>
    <h2>{{title ? title: '[NO TITLE]'}}</h2>
    <h3>{{questionNum}} {{questionNum == 1 ? 'question': 'questions'}}</h3>
  </div>
</template>
<script>
export default {
  props: {
    title: String,
    questionNum: Number,
  }
}
</script>
