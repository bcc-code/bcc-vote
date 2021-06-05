<template>
    <div class="absolute log-container p-4 bg-black opacity-50 text-white" :key="refreshCount">
        <h4>Logging information {{refreshCount}}</h4>
        connection: {{$client.io.connected}}
    </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    data(){
        return {
            refreshCount: 0
        }
    },
    created(){
        console.log(this.$client.io);
        setTimeout( () => {
            console.log('closing')
            this.$client.io.close();
        }, 2000)
        setInterval( () => {
            this.refreshCount ++;
        }, 200)
    }
})
</script>

<style scoped>
    .log-container {
        top: 48px;
        left: 0px;
    }
</style>
