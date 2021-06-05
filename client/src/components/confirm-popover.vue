<template>
    <div class="h-screen w-full fixed top-0 left-0 z-50 flex items-center justify-center bg-dark-55 text-black">
        <div class="dialog-size">
            <div class="w-full h-full bg-white rounded-t-lg">
                <div class="h-half flex flex-col justify-between pt-10 px-10"> 
                    <div class="text-center">
                        <h1 class="font-bold mb-3">{{$t('labels.vote-confirmation')}}</h1>
                        <p>{{chosenOption.explanation}}</p>
                    </div>
                    <div class="w-full flex justify-between">
                        <button class="w-full rounded-full p-4 bg-gray-200 mx-2" @click="$emit('cancel')">
                            <h5 class="font-bold text-white">{{$t('actions.cancel')}}</h5>
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
import { Answer } from '../domain/Poll'
import { defineComponent, PropType } from 'vue'
export default defineComponent({
    props: {
        chosenOption: {
            type: Object as PropType<Answer>,
            required: true
        }
    },
    emits: ['cancel','confirm']
})
</script>
<style scoped>
.bg-dark-55 {
    background: #00000055;
}

.dialog-size {
    @apply w-full;
    @apply h-full;
    padding-top:40vh;
}

@media screen and (min-width: 767.9px) {
    .dialog-size {
        @apply max-w-screen-md;
        @apply mx-auto;
    }
}
</style>
