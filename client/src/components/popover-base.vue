<template>
    <div class="h-screen w-full fixed top-0 left-0 z-50 bg-dark" @click="$emit('close')">
        <div class="dialog-size bg-white pt-6 pb-20 px-4 md:px-10 md:py-8 relative" :style="`--heightVar: ${mobileHeight}`" @click.stop>
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        mobileHeight: {type: String, default: "50vh"}
    },
    emits: ['close']
});
</script>

<style>
.bg-dark {
    background: rgba(0, 0, 0, 0.6);
}

.dialog-size {
    @apply w-full;
    @apply rounded-t-lg;
    height: var(--heightVar);
    margin-top: calc(100vh - var(--heightVar));
    overflow: auto;
}

@media screen and (min-width: 768px) {
    .dialog-size {
        @apply max-w-screen-md;
        @apply mx-auto;
        @apply rounded-lg;
        height: unset;
        margin-top: 20vh;
    }
}
</style>
