<template>
    <div class="absolute log-container p-4 bg-black opacity-75 text-white" :key="refreshCount">
        <h4>Logging information {{refreshCount}}</h4>
        connection: {{$client.io.connected}}
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
        console.log(this.$client.io);
        setInterval( () => {
            this.refreshCount ++;
        }, 200)
    },
    methods: {
        sendRequest(){
            console.log(this.$user);
            this.$client.service('user').find({})
            .then((res: any) => {
                this.$showError('Found '+res.total+' users')
            })
        }
    },
})
</script>

<style scoped>
    .log-container {
        top: 48px;
        left: 0px;
    }
</style>
