<template>
    <div class="relative" @click="copy">
        <div v-show="visible" class="absolute bg-black p-2 rounded-lg text-white" style="bottom: 120%; left: -50%">
            {{$t('info.copied')}}
        </div>
        <slot>
        </slot>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        toCopy: {type: String, required: true},
    },
    data() {
        return {
            visible: false
        }
    },
    methods: {
        copy(){
            navigator.clipboard.writeText(this.toCopy).then(() => {
                this.visible = true;
                setTimeout(() => {
                    this.visible = false;
                }, 1000)
            }, () => {
                this.$showError('Unable to copy');
            })
        }
    }
})
</script>
