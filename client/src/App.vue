<template>
  <div id="app">
      <router-view v-if="$route.path.includes('/prototype')"></router-view>
      <template v-else>
        <Header :isNav="!mobile"/>
        <router-view :style="`min-height: calc(100vh - ${layoutHeight}px);`" :mobile="mobile"/>
        <Footer />
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
        layoutHeight: '328',
        mobile: true,
      }
    }
}
</script>

