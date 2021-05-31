<template>
    <div v-if="type == 'checkbox' || type == 'radio'" class="flex items-center mb-5">
        <CheckboxField v-model="model" :value="value"/>
        <h5 class="font-bold ml-3">{{$t(`fields.${translation}`)}}</h5>
    </div>
    <section v-else class="mb-5 max-w-sm">
        <div class="flex justify-between">
        <h5 class="mb-1 font-bold">{{$t(`fields.${translation}`)}}</h5>
        <h5 v-if="optional" class="text-gray-600">{{$t('fields.optional')}}</h5>
        </div>
        <input v-if="type == 'input'" class="box-field" v-model="model">

        <input v-if="type == 'number'" type="number" class="box-field" v-model="model">

        <!-- if you pass an array it will be a multiple select -->
        <SelectField v-if="type == 'select'" v-model="model" :options="options"/>

        <!-- You should give it the unix timestamp -->
        <DateField class="box-field" v-else-if="type == 'date'" v-model="model"/>

        <textarea v-else-if="type == 'textarea'" v-model="model"></textarea>
        
    </section>
</template>
<script lang="ts">
import DateField from './input-date-field.vue'
import SelectField from './input-select-field.vue'
import CheckboxField from './input-checkbox-field.vue'
import { defineComponent,PropType } from 'vue'
export default defineComponent({
    components: {
        DateField,
        SelectField,
        CheckboxField,
    },
    props: {
        // the v-model value (see vue 3 documentation)
        modelValue: Object as PropType<any>,

        // General props 
        translation: { type: String, required: true },
        required: { type: Boolean, default: false },
        type: { type: String, required: false },
        optional: {type: Boolean, default: false},

        // For select
        options: { type: Array, required: false },

        // If you specify the value the the checkbox will act as a radio button
        value: {type: String, required: false}
    },
    computed: {
        model: {
            get () {
                return this.modelValue
            },
            set (val) {
                if(this.type == 'number')
                    val = parseInt(val);
                this.$emit('update:modelValue', val);
            }
        }
    }
})
</script>
<style scoped>
.box-field {
    @apply border-2;
    @apply border-gray-200;
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
