<template>
  <div class="position" :class="type">{{content}}</div>
</template>
<script>
export default {
  props: {
    content: String,
    type: String
  }
}
</script>

<style scoped>
  .position{
    position: absolute;
    padding: 10px 30px;
    font-size: 20px;
    bottom: 50px;
    right: 50px;
    border-radius: 20px;
    color: white;
  }
  .error {
    background-color: red;
  } 
  .success{
    background-color: green;
  }
</style>