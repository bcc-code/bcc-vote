<template>
  <div id="app">
    <router-view v-if="$route.path.includes('/prototype')"></router-view>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script lang="ts">
export default {
}
</script>

<style>
</style>
