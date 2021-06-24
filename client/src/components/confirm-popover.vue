<template>
    <div class="h-screen w-full fixed top-0 left-0 z-50 bg-dark text-black" @click="$emit('resign')">
        <div class="dialog-size bg-white rounded-lg py-10 px-5 md:px-10 md:py-8 relative" @click.stop>
            <div class="text-center mb-9">
                <div class="font-bold mb-6 text-4xl md:text-3xl">
                    <slot name="header"></slot>
                </div>
                <p class="text-gray-700">
                    <slot name="description"></slot>
                </p>
            </div>
            <XIcon class="hidden w-6 h-6 p-1 mt-8 mr-4 absolute top-0 right-0 cursor-pointer md:block" @click="$emit('resign')"/>
            <div class="w-full grid grid-cols-2 gap-5 max-w-md mx-auto">
                <button class="w-full rounded-full p-4 bg-gray-200" @click="$emit('cancel')">
                    <h5 class="font-bold text-blue-900">{{$t('actions.'+cancelTranslation)}}</h5>
                </button>
                <button class="w-full rounded-full p-4 bg-blue-900" @click="$emit('confirm')">
                    <h5 class="font-bold text-white">{{$t('actions.'+confirmTranslation)}}</h5>
                </button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import XIcon from 'heroicons-vue3/outline/XIcon'
import { defineComponent} from 'vue'
export default defineComponent({
    components: {
        XIcon,
    },
    props: {
        confirmTranslation: {type: String, default: 'confirm'},
        cancelTranslation: {type: String, default: 'cancel'}
    },
    emits: ['cancel','confirm', 'resign'],
})
</script>
<style scoped>
.bg-dark {
    background: rgba(0, 0, 0, 0.6);
}

.dialog-size {
    @apply w-full;
    @apply h-full;
    margin-top:50vh;
}

@media screen and (min-width: 768px) {
    .dialog-size {
        @apply max-w-screen-md;
        @apply mx-auto;
        height: unset;
        margin-top: 20vh;
    }
}
</style>
