<template>
  <div>
    Hello world
    <div>{{$store.state.count}}</div>
    <input @click="testMethod" type="submit" value="increment"/>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    methods: {
      testMethod(){
        this.$store.commit('increment');
        console.log(this.$store.state.count);
      }
    }
  });
</script>