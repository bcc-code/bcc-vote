<template>
    <div class="h-screen w-full fixed top-0 left-0 z-50 flex items-center justify-center bg-dark-55 text-black" @click="click">
        <div class="dialog-size">
            <div class="w-full h-full bg-white rounded-t-lg">
                <div class="h-min-half flex flex-col justify-between pt-10 px-6 md:px-10"> 
                    <slot>
                    
                    </slot>
                    <div class="w-full flex justify-between">
                        <button class="w-full rounded-full p-4 bg-gray-200 mx-2" @click="$emit('cancel')">
                            <h5 class="font-bold text-blue-900">{{$t('actions.cancel')}}</h5>
                        </button>
                        <button class="w-full rounded-full p-4 bg-blue-900 mx-2" @click="$emit('confirm')">
                            <h5 class="font-bold text-white">{{$t('actions.confirm')}}</h5>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent} from 'vue'
export default defineComponent({
    props: {
        confirmTranslation: {type: String, default: 'confirm'},
        cancelTranslation: {type: String, default: 'cancel'}
    },
    emits: ['cancel','confirm'],
    methods: {
        click(elm:any):void{
            console.log(elm)
        }
    }
})
</script>
<style scoped>
.bg-dark-55 {
    background: #00000055;
}

.dialog-size {
    @apply w-full;
    @apply h-full;
    margin-top:80vh;
}

@media screen and (min-width: 767.9px) {
    .dialog-size {
        @apply max-w-screen-md;
        @apply mx-auto;
    }
}
</style>
