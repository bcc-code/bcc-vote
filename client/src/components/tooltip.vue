<template>
    <div class="relative" @mouseover="hovering = true" @mouseleave="hovering = false">
        <div v-show="showToolTip" class="absolute bg-black p-2 rounded-lg text-white tooltip-position" :class="{'right-0': align === 'right', 'centered-tooltip': align === 'center'}">
            {{translation}}
        </div>
        <slot>
        </slot>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    props: {
        translation: { type: String, required: true},
        toggledTooltip: { type: Boolean, default: undefined},
        align: {type: String, default: 'left'}
    },
    data() {
        return {
            hovering: false
        }
    },
    computed: {
        showToolTip() {
            if(this.toggledTooltip === true) return true
            if(this.hovering === true && this.toggledTooltip === undefined) return true
            return false
        }
    }
})
</script>
<style scoped>
    .centered-tooltip{
        transform: translateX(-50%);
    }
    .tooltip-position{
        top: -45px; 
        width: max-content;
    }
</style>
