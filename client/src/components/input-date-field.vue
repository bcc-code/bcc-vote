<template>
    <div class="formdate"  @keyup.capture="updateValue">
        <form class="date">
            <input v-model="day" placeholder="dd" @input="goNext">
            <span class="px-1">/</span>
            <input v-model="month" placeholder="mm" @input="goNext">
            <span class="px-1">/</span>
            <input v-model="year" placeholder="yyyy"  style="width:40px;" @input="goNext">
            <span class="px-1"></span>
            <input v-model="hour"  placeholder="hh" @input="goNext">
            <span>:</span>
            <input v-model="minute" placeholder="mm">
        </form>
    </div>
</template>

<script>

import functions from '../util/functions.js'

export default {
    name: 'FormDate',
    props: {
        value: {
            type: [Number, String, Date],
            required: false,
        },
        modelValue: Date
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
        init(){
            if(this.modelValue.getTime()){
                const date = this.modelValue
                this.day = this.format(date.getDay())
                this.month = this.format(date.getMonth())
                this.year = this.format(date.getFullYear())
                this.hour = this.format(date.getHours())
                this.minute = this.format(date.getMinutes())
            }
        },
        format(val){
            return val.toString().padStart(2, '0')
        },
        updateValue() {
            const stringDate = `${this.year}-${this.month}-${this.day} ${this.hour}:${this.minute}:00`
            const time = Date.parse(stringDate)
            if (Number.isNaN(time)) {
                return
            }
            if(time < new Date().getTime())
                return
            this.$emit('update:modelValue', new Date(time))
        },
        resetValue() {
            this.day = ''
            this.month = ''
            this.year = ''
            this.focusElement = 'day'
            this.$emit('update:modelValue', 0)
        },
        goNext(evt){
            if(evt.target.value.length === evt.target.placeholder.length)
                functions.focusOnNextFormInput(evt.target)
        }
    }
}
</script>
<style scoped>

.date {
    @apply text-gray-700;
}

.date input {
    width: 30px;
    @apply flex-grow-0;
    -moz-appearance: textfield;
    @apply text-center;
}

.formdate .date input:focus {
    @apply outline-none;
}

</style>
