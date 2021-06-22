<template>
    <h4 class="font-bold px-3 py-1 rounded-full flex-shrink-0" :class="styling">{{$t(`labels.polling-event-status.${status}`)}}</h4>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        status: {type: String, required: true},
    },
    computed: {
        styling():string{
            switch(this.status){
                case 'not_started': return 'text-blue-500 bg-blue-200'
                case 'live': return 'text-red-500 bg-red-200'
                case 'finished': return 'text-green-400 bg-green-200'
                case 'archived': return 'text-gray-700 bg-gray-500'
            }
            return ''
        }
    }
})
</script>
