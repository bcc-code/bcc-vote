<template>
    <PopoverBase v-if="showFeedback" @close="showFeedback = false" mobileHeight="70vh">
        <div class="font-bold pt-0.5">
            <div class="flex justify-between items-center mb-6">
                <div class="centering-div"></div>
                <h3>{{$t('labels.feedback-vote')}}</h3>
                <XIcon class="w-6 h-6 p-1 cursor-pointer" @click="showFeedback = false"/>
            </div>
            <div class="mx-auto" style="max-width:386px">
                <h5 class="mb-2">{{$t('labels.rate-experience')}}</h5>
                <div class="flex justify-between mb-5">
                    <StarIcon v-for="i in maxRating" :key="i" class="w-12" @click="rating = i" :style="getColor(i)"/>
                </div>
                <FormField class="mb-9" type="textarea" translation="any-trouble" v-model="textVal" baseHeight="100px" :placeholder="$t('placeholders.type-here')" enableNewLine/>
                <div class="w-full grid grid-cols-2 gap-5">
                    <button class="w-full rounded-full p-4 bg-gray-200" @click="showFeedback = false">
                        <h5 class="font-bold text-blue-900">{{$t('actions.skip')}}</h5>
                    </button>
                    <button class="w-full rounded-full p-4 bg-blue-900" :class="submitted ? 'opacity-50 cursor-default':''" @click="sendFeedback">
                        <h5 class="font-bold text-white">{{$t('actions.submit')}}</h5>
                    </button>
                </div>
            </div>
        </div>
    </PopoverBase>
</template>
<script lang="ts">

import XIcon from 'heroicons-vue3/outline/XIcon'
import StarIcon from 'heroicons-vue3/solid/StarIcon'
import PopoverBase from './popover-base.vue'

import { defineComponent} from 'vue'
import FormField from './form-field.vue'
export default defineComponent({
    components: {
        XIcon,
        StarIcon,
        FormField,
        PopoverBase
    },
    props: {
        confirmTranslation: {type: String, default: 'confirm'},
        cancelTranslation: {type: String, default: 'cancel'},
        pollingEventId: {type: String, required: true},
    },
    data(){
        return {
            showFeedback: true,
            maxRating: 5,
            textRows: 4,
            rating: 0,
            textVal: '',
            submitted: false
        }
    },
    methods: {
        sendFeedback(){
            if(this.submitted)
                return;
            this.submitted = true

            const feedbackData = {
                pollingEventId: this.pollingEventId,
                personID: this.$user.personID,
                message: this.textVal,
                rating: this.rating
            }
            this.$client.service('feedback').create(feedbackData).then((res: any) => {
                this.$showSuccess(this.$t('info.thank-for-feedback'))
                this.showFeedback = false
            }).catch((err:Error) => {
                this.submitted = false
                this.$handleError(err)
            });
            

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
.centering-div {
    @apply w-6;
}

@media screen and (max-width: 426px){
    .centering-div{
        display: none;
    }
}
</style>
