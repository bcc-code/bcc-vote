<template>
  <div id="app">
    <router-view v-if="$route.path.includes('/prototype')"></router-view>
    <template v-else>
      <div class="app-container">
        <Header />
        <transition name="fade" mode="out-in">
            <router-view :key="$route.fullPath" :style="`min-height: calc(100vh - ${layoutHeight}px);`"/>
        </transition>
        <Footer />
      </div>
    </template>
  </div>
</template>

<script lang="ts">

import Footer from "./components/layout-footer.vue"
import Header from "./components/layout-header.vue"

export default {
    components: {
        Footer,
        Header,
    },
    data (){
      return {
        layoutHeight: '376',
      }
    },
    
}
</script>
<style scoped>
.app-container {
    min-height: calc(100vh - 96px);
    @apply relative;
    @apply bg-gray-100;
}
</style>
<style>
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.1s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}
</style>
