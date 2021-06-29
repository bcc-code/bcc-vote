<template>
    <div class="h-screen w-full fixed top-0 left-0 z-50 bg-dark" @click="$emit('close')">
        <div class="dialog-size bg-white rounded-t-lg py-6 px-4 md:px-10 md:py-8 relative" :style="`--heightPercent: ${mobileHeight}`" @click.stop>
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        mobileHeight: {type: String, default: "50vh"}
    },
    emits: ['close']
})
</script>

<style>
.bg-dark {
    background: rgba(0, 0, 0, 0.6);
}

.dialog-size {
    @apply w-full;
    height: var(--heightPercent);
    margin-top: calc(100vh - var(--heightPercent));
    overflow: auto;
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