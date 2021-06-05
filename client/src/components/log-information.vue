<template>
    <div class="absolute log-container p-2 bg-black opacity-75 text-white">
        <div v-if="open" :key="refreshCount">
            <div class="flex justify-between items-center mb-2">
            <h4>Logging{{dots}}</h4>
            <XIcon class="w-6 h-6 block" @click="open = false"/>
            </div>
            <h5>id: {{$client.io.io.engine.id}}</h5>
            <h5>connection: {{$client.io.connected}}</h5>
            <h5>ping timer: {{$client.io.io.engine.pingTimeoutTimer}}</h5>
            <h5>ready state: {{$client.io.io.engine.readyState}}</h5>
            
            <h4 @click="sendRequest">Send some request</h4>
        </div>
        <AdjustmentsIcon v-else class="w-6 h-6 block" @click="open = true"/>
    </div>
</template>


<script lang="ts">
import AdjustmentsIcon from 'heroicons-vue3/outline/AdjustmentsIcon'
import XIcon from 'heroicons-vue3/outline/XIcon'
import { defineComponent } from 'vue'

export default defineComponent({
    components: {
        AdjustmentsIcon,
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
    .log-container {
        top: 48px;
        right: 0px;
        z-index: 100;
        @apply rounded-bl-lg
    }
</style>
