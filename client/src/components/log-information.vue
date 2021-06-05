<template>
    <div class="absolute log-container p-4 bg-black opacity-75 text-white" :key="refreshCount">
        <h4>Logging information {{refreshCount}}</h4>
        <h5>id: {{$client.io.io.engine.id}}</h5>
        <h5>connection: {{$client.io.connected}}</h5>
        <h5>ping timer: {{$client.io.io.engine.pingTimeoutTimer}}</h5>
        <h5>ready state: {{$client.io.io.engine.readyState}}</h5>
        
        <h4 @click="sendRequest">Send some request</h4>
    </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    data(){
        return {
            refreshCount: 0,
        }
    },
    created(){
        console.log(this.$client.io.io.engine);
        setInterval( () => {
            this.refreshCount ++;
        }, 200)
    },
    methods: {
        sendRequest(){
            console.log(this.$client.io);
            this.$client.service('user').find({})
            .then((res: any) => {
                this.$showError('Found '+res.total+' users')
            })
        }
    },
})
</script>

<style scoped>
    h4 {
        @apply my-3
    }
    .log-container {
        top: 48px;
        left: 0px;
        z-index: 100;
    }
</style>
