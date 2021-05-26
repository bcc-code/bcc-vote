<template>
  <div>
    <div>{{$store.state.count}}</div>
    <input @click="$store.commit('increment')" type="submit" value="increment"/>
  </div>
</template>

<script lang="ts">


</script>