<template>
    <div class="formdate"  @keyup.capture="updateValue">
        <div class="date">
            <input ref="day" v-model="day" type="string" placeholder="dd" style="width:22px;">
            <span class="px-1">/</span>
            <input ref="month" v-model="month" type="string" placeholder="mm" style="width:28px;">
            <span class="px-1">/</span>
            <input ref="year" v-model="year" type="string" placeholder="yyyy"  style="width:40px;">
            <span class="px-1"></span>
            <input ref="hour" v-model="hour" type="string" placeholder="hh" style="width:40px;">
            <span>:</span>
            <input ref="minute" v-model="minute" type="string" placeholder="mm" style="width:40px;">
        </div>
        <i class="cursor-pointer fa fa-times my-1 w-1/12" @click="resetValue"></i>
    </div>
</template>

<script>
export default {
    name: 'FormDate',
    props: {
        value: {
            type: [Number, String, Date],
            required: false,
        },
        modelValue: Number
    },
    data() {
        return {
            minute: '',
            hour: '',
            day: '',
            month: '',
            year: '',
            focusElement: 'day',
        }
    },
    created(){
        this.init()
    },
    methods: {
        resetValue() {
            this.day = '';
            this.month = '';
            this.year = '';
            this.focusElement = 'day'
            this.$emit('input','');
        },
        init(){
            if(this.modelValue){
                this.day = this.format(new Date(this.modelValue).getDay());
                this.month = this.format(new Date(this.modelValue).getMonth());
                this.year = this.format(new Date(this.modelValue).getFullYear());
                this.hour = this.format(new Date(this.modelValue).getHours());
                this.minute = this.format(new Date(this.modelValue).getMinutes());
            }
        },
        format(val){
            return val.toString().padStart(2, '0');
        },
        updateValue() {
            console.log('update');
            const stringDate = `${this.year}-${this.month}-${this.day} ${this.hour}:${this.minute}:00`
            const time = Date.parse(stringDate);
            if (Number.isNaN(time)) {
                return;
            }
            this.$emit('update:modelValue', time)
        }
    }
}
</script>
<style scoped>
.form-field .formdate {
    @apply h-10;
}

.formdate {
    @apply appearance-none;
    @apply flex;
    @apply items-center;
    @apply justify-between;
    @apply px-4;
    @apply w-full;
    @apply bg-white;
    @apply text-gray-700;
    @apply border-2;
    @apply border-gray-200;
    @apply rounded;
    @apply leading-tight;
}

.formdate .date {
    @apply flex;
    @apply items-center;
}

.formdate .date input {
    -moz-appearance: textfield;
    @apply bg-transparent;
    @apply text-center;
}

.formdate .date input:focus {
    @apply outline-none;
    @apply border-none;
}

.formdate .date input::-webkit-inner-spin-button {
    display: none;
}
</style>
