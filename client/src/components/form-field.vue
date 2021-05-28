<template>
    <section class="mb-5 form-field" :name="name">
        <div class="flex justify-between">
        <h5 class="mb-1 font-bold">{{$t(`fields.${name}`)}}</h5>
        <h5 v-if="optional" class="text-gray-600">{{$t('fields.optional')}}</h5>
        </div>
        <input v-if="type == 'input'" class="box-field" v-model="model">

        <input v-if="type == 'number'" type="number" class="box-field" v-model="model">

        <!-- You should give it the unix timestamp -->
        <DateField v-else-if="type == 'date'" v-model="model"/>

        <textarea v-else-if="type == 'textarea'" v-model="model"></textarea>
        
    </section>
</template>
<script>
import DateField from './input-date-field.vue'

export default {
    components: {
        DateField,
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

.box-colors {
    @apply appearance-none;
    @apply bg-white;
    @apply border-2;
    @apply border-gray-200;
    @apply rounded;
    @apply leading-tight;
    @apply text-black;
}

.box-field {
    @apply flex;
    @apply items-center;
    @apply w-full;
    @apply px-4;
    @apply h-10;
    @apply box-colors;
}

input:not([type=checkbox]):focus, textarea:focus {
    @apply outline-none;
    @apply border-gray-500;
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
