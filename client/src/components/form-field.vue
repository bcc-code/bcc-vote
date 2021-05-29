<template>
    <section class="mb-5 form-field" :name="name">
        <div class="flex justify-between">
        <h5 class="mb-1 font-bold">{{$t(`fields.${name}`)}}</h5>
        <h5 v-if="optional" class="text-gray-600">{{$t('fields.optional')}}</h5>
        </div>
        <input v-if="type == 'input'" class="box-field" v-model="model">

        <input v-if="type == 'number'" type="number" class="box-field" v-model="model">

        <SelectField v-if="type == 'select'" v-model="model" :options="options"/>

        <!-- You should give it the unix timestamp -->
        <DateField class="box-field" v-else-if="type == 'date'" v-model="model"/>

        <textarea v-else-if="type == 'textarea'" v-model="model"></textarea>
        
    </section>
</template>
<script>
import DateField from './input-date-field.vue'
import SelectField from './input-select-field.vue'

export default {
    components: {
        DateField,
        SelectField,
    },
    props: {
        // General props 
        name: { type: String, required: true },
        required: { type: Boolean, default: false },
        type: { type: String, required: false },
        optional: {type: Boolean, default: false},
        // Select/Lookup props
        options: { type: Array, required: false },
        label: { type: String, required: false },

        modelValue: String|Number,
    },
    data: function(){
        return {
            setValue: false,
        }
    },
    computed: {
        model: {
            get () {
                this.setValue = false
                return this.modelValue
            },
            set (val) {
                console.log(val);
                this.$emit('update:modelValue', val);
            }
        }
    }
}
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
