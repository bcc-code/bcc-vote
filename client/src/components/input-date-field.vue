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

<script lang="ts">

import { defineComponent } from 'vue'
export default defineComponent({
    name: 'FormDate',
    props: {
        value: {
            type: [Number, String, Date],
            required: false,
        },
        modelValue: {type: Date, required: true}
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
    created():void{
        this.init()
    },
    methods: {
        init():void {
            if(this.modelValue.getTime()){
                const date = this.modelValue
                this.day = this.format(date.getDate())
                this.month = this.format(date.getMonth() + 1)
                this.year = this.format(date.getFullYear())
                this.hour = this.format(date.getHours())
                this.minute = this.format(date.getMinutes())
            }
        },
        format(val:number):string{
            return val.toString().padStart(2, '0')
        },
        updateValue():void {
            const stringDate = `${this.year}-${this.month}-${this.day} ${this.hour}:${this.minute}:00`
            const time = Date.parse(stringDate)
            if (Number.isNaN(time)) {
                return
            }
            this.$emit('update:modelValue', new Date(time))
        },
        resetValue():void {
            this.day = ''
            this.month = ''
            this.year = ''
            this.focusElement = 'day'
            this.$emit('update:modelValue', 0)
        },
        goNext(evt: any):void{
            if(evt.target.value.length === evt.target.placeholder.length)
                this.focusOnNextFormInput(evt.target)
        },
        focusOnNextFormInput: (el: any):void => {
            const currentIndex = Array.from(el.form.elements).indexOf(el)
            if (currentIndex < el.form.elements.length - 1)
                el.form.elements.item(currentIndex + 1).focus()
        }
    }
})
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
