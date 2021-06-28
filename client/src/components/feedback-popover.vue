<template>
    <div v-if="showFeedback" class="h-screen w-full fixed top-0 left-0 z-50 bg-dark text-black" @click="showFeedback = false">
        <div class="dialog-size bg-white rounded-lg py-10 px-5 md:px-10 md:py-8 relative" @click.stop>
            <div class="mb-9 font-bold ">
                <div class="flex justify-between items-center mb-6">
                    <h3>{{$t('labels.feedback-vote')}}</h3>
                    <XIcon class="w-6 h-6 p-1 cursor-pointer" @click="showFeedback = false"/>
                </div>
                <div class="mx-auto" style="max-width:386px">
                <h5 class="mb-2">{{$t('labels.rate-experience')}}</h5>
                <div class="flex justify-between mb-5">
                    <StarIcon v-for="i in maxRating" :key="i" class="w-12" @click="rating = i" :style="getColor(i)"/>
                </div>
                <FormField type="textarea" translation="any-trouble" v-model="textVal" baseHeight="100px" enableNewLine/>
                </div>
            </div>
            <div class="w-full grid grid-cols-2 gap-5 max-w-md mx-auto">
                <button class="w-full rounded-full p-4 bg-gray-200" @click="showFeedback = false">
                    <h5 class="font-bold text-blue-900">{{$t('actions.skip')}}</h5>
                </button>
                <button class="w-full rounded-full p-4 bg-blue-900" @click="sendFeedback">
                    <h5 class="font-bold text-white">{{$t('actions.submit')}}</h5>
                </button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">

import XIcon from 'heroicons-vue3/outline/XIcon'
import StarIcon from 'heroicons-vue3/solid/StarIcon'


import { defineComponent} from 'vue'
import FormField from './form-field.vue'
export default defineComponent({
    components: {
        XIcon,
        StarIcon,
        FormField,
    },
    props: {
        confirmTranslation: {type: String, default: 'confirm'},
        cancelTranslation: {type: String, default: 'cancel'}
    },
    data(){
        return {
            showFeedback: true,
            maxRating: 5,
            textRows: 4,
            rating: 0,
            textVal: "random text",
        }
    },
    methods: {
        sendFeedback(){
            console.log('sending feedback')
            console.log(this.textVal);
            
            console.log(this.rating);
        },
        getColor(i: number):string {
            if(i <= this.rating)
                return 'color:#DFB300'
            return 'color:#F2F2F2'
        }
    }
})
</script>
<style scoped>
.bg-dark {
    background: rgba(0, 0, 0, 0.6);
}

.dialog-size {
    @apply w-full;
    @apply h-full;
    margin-top:30vh;
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
