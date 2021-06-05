<template>
    <div class="absolute log-container p-4 bg-black opacity-50 text-white">
        <h4>Logging information</h4>
        connection: {{$client.io.connected}}
    </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
})
</script>

<style scoped>
    .log-container {
        top: 48px;
        left: 0px;
    }
</style>
