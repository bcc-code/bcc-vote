<template>
    <div id="container" class="container vertical">
        <h1 class="font-bold">Homepage</h1>
        <button @click="toastMethod('Test text')">Toast</button>
        <SparklesIcon class="h-20 w-20 text-blue-500"/>
        <Spinner />
    </div>
</template>

<script lang="ts">
import { SparklesIcon  } from '@heroicons/vue/solid'
import { defineComponent } from 'vue'
export default defineComponent({
    components: { SparklesIcon },
    name: 'Home',
    data () {
        return {
        }
    },
    methods: {
        toastMethod(text:string) {
            this.$toast(text)
        }
    }
})
</script>
