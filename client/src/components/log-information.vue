<template>
    <div class="p-3 relative">
        <div v-if="open" class="absolute positioning size opacity-75 bg-black text-white p-3">
            <h4>Logging{{dots}}</h4>
            <h5>id: {{$client.io.io.engine.id}}</h5>
            <h5>connection: {{$client.io.connected}}</h5>
            <h5>ping timer: {{$client.io.io.engine.pingTimeoutTimer}}</h5>
            <h5>ready state: {{$client.io.io.engine.readyState}}</h5>
        </div>
        <XIcon v-if="open" class="w-6 h-6 block" @click="open = false"/>
        <StatusOnline v-else class="w-6 h-6 block" @click="open = true"/>
    </div>
</template>


<script lang="ts">
import StatusOnline from 'heroicons-vue3/outline/StatusOnlineIcon'
import XIcon from 'heroicons-vue3/outline/XIcon'
import { defineComponent } from 'vue'

export default defineComponent({
    components: {
        StatusOnline,
        XIcon,
    },
    data(){
        return {
            open: false as boolean,
            refreshCount: 0 as number,
            interval: undefined as any,
        }
    },
    computed: {
        dots():string{
            return '.'.repeat(this.refreshCount % 4)
        },
        open: {
            set(val: boolean):void{
                clearInterval(this.interval);
                if(val)
                    this.interval = setInterval( () => {
                        this.refreshCount ++;
                    }, 1000)
                
            },
            get():boolean{
                return (!this.interval === undefined)
            }
        }
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
    .positioning {
        top: 100%;
        right: 0;
    }
    .size {
        width: max-content
    }
</style>