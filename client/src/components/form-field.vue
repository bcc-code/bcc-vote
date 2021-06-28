<template>
    <div v-if="type == 'checkbox'" class="flex items-center mb-5">
        <label class="inline-flex cursor-pointer">
            <CheckboxField v-model="model" :value="value"/>
            <h5 class="font-bold ml-3">{{$t(`fields.${translation}`)}}</h5>
        </label>
    </div>
    <div v-else-if="type == 'radio'" class="flex items-center mb-5">
        <label class="inline-flex cursor-pointer">
            <RadioField v-model="model" :value="value"/>
            <h5 class="font-bold ml-3">{{$t(`fields.${translation}`)}}</h5>
        </label>
    </div>
    <section v-else class="mb-5 w-full max-w-sm relative">
        <div class="flex justify-between">
        <h5 class="mb-1 font-bold">{{$t(`fields.${translation}`)}} {{additionalText}}</h5>
        <h5 v-if="optional" class="text-gray-600">{{$t('fields.optional')}}</h5>
        </div>
        <input v-if="type == 'string'" class="box-field" :placeholder="placeholder"  v-model="model">

        <input v-if="type == 'number'" type="number" :placeholder="placeholder"  class="box-field" v-model="model">

        <!-- if you pass an array it will be a multiple select -->
        <SelectField v-if="type == 'select'" v-model="model" :placeholder="placeholder"  :options="options"/>

        <!-- You should give it the unix timestamp -->
        <DateField v-else-if="type == 'date'"  v-model="model" :placeholder="placeholder" class="box-field"/>

        <TextareaField v-else-if="type == 'textarea'" v-model="model" :placeholder="placeholder" class="box-field" :baseHeight="baseHeight" :enableNewLine="enableNewLine"/>

        <XIcon v-if="removable" class="absolute text-gray-800 w-10 h-10 p-3 bottom-0 right-0 cursor-pointer" @click="$emit('remove')"/>
    </section>
</template>
<script lang="ts">
import DateField from './input-date-field.vue'
import SelectField from './input-select-field.vue'
import CheckboxField from './input-checkbox-field.vue'
import RadioField from './input-radio-field.vue'
import TextareaField from './input-textarea-field.vue'
import XIcon from 'heroicons-vue3/solid/XIcon'

import { defineComponent,PropType } from 'vue'

type ModelType = number|string|boolean|Array<string>|Date|undefined

export default defineComponent({
    components: {
        DateField,
        SelectField,
        CheckboxField,
        RadioField,
        TextareaField,
        XIcon,
    },
    props: {
        // the v-model value (see vue 3 documentation)
        modelValue: {type: [Number, String, Boolean, Array, Date] as PropType<ModelType>},

        // General props 
        translation: { type: String, required: true },
        required: { type: Boolean, default: false },
        type: { type: String, default: 'textarea' },
        optional: {type: Boolean, default: false},
        removable: { type: Boolean, requiered: false},
        placeholder: { type: String, required: false},

        additionalText: { type: [String, Number], required: false},

        // For select
        options: { type: Array, required: false },

        // For textarea
        baseHeight: { type: String, default: '0'},
        enableNewLine: {type: Boolean, default: false},

        // If you specify the value the the checkbox will act as a radio button
        value: {type: String, required: false}
    },
    computed: {
        model: {
            get():ModelType {
                return this.modelValue
            },
            set (val:ModelType) {
                if(this.type === 'number' && typeof val === 'string')
                    val = parseInt(val)
                this.$emit('update:modelValue', val)
            }
        }
    }
})
</script>
<style scoped>
.box-field {
    @apply border-2;
    @apply border-gray-500;
    @apply rounded;

    @apply w-full;
    @apply px-4;
    @apply py-2;
}

.box-field:focus {
    @apply outline-none
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type=number] {
    -moz-appearance:textfield;
}

</style>
