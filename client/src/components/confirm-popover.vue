<template>
    <PopoverBase @close="$emit('resign')">
        <div class="text-center mb-9 mt-4">
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
            <button class="w-full rounded-full p-4 bg-blue-900" :class="active ? '':'button-inactive'" @click="$emit('confirm')">
                <h5 class="font-bold text-white">{{$t('actions.'+confirmTranslation)}}</h5>
            </button>
        </div>
    </PopoverBase>
</template>
<script lang="ts">
import XIcon from 'heroicons-vue3/outline/XIcon';
import PopoverBase from './popover-base.vue';
import { defineComponent} from 'vue';
export default defineComponent({
    components: {
        XIcon,
        PopoverBase
    },
    props: {
        confirmTranslation: {type: String, default: 'confirm'},
        cancelTranslation: {type: String, default: 'cancel'},
        active: {type: Boolean, default: true}
    },
    emits: ['cancel','confirm', 'resign'],
});
</script>
