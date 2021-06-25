<template>
    <ToolTip :translation="$t('info.copied')" :toggledTooltip="showToolTip" @click="copy">
        <slot>
        </slot>
    </ToolTip>
</template>

<script lang="ts">
import ToolTip from '../components/tooltip.vue'
import { defineComponent } from 'vue'
export default defineComponent({
    components: {
        ToolTip
    },
    props: {
        toCopy: {type: String, required: true},
    },
    data() {
        return {
            showToolTip: false
        }
    },
    methods: {
        copy(){
            navigator.clipboard.writeText(this.toCopy).then(() => {
                this.showToolTip = true;
                setTimeout(() => {
                    this.showToolTip = false;
                }, 1000)
            }, () => {
                this.$handleError('Unable to copy');
            })
        }
    }
})
</script>
