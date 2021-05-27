<template>
    <div id = "app">
        <router-view :style="`min-height: calc(100vh - ${layoutHeight}px);`"/>
        <Footer />
    </div>
</template>

<script lang="ts">

import Footer from "./components/layout-footer.vue"

export default {
    components: {
        Footer,
    },
    data (){
      return {
        layoutHeight: '100'
      }
    }
}
</script>

