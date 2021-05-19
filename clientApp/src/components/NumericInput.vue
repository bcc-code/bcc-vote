<template>
  <div class="horizontal numeric-input">
    
    <div  class="box-40 color-grey" @click="changeValue(-1)">
      <icon-base class="box-40" iconColor="#333"><icon-minus /></icon-base>
    </div>
    <input type="number" :min="min" :max="max" v-model="showedValue" @blur="updateVisible()" @focus="$event.target.select()" @keydown.enter.prevent="focusNext" @keydown.down.prevent="focusNext" @keydown.up.prevent="focusPrev">
    <div  class="box-40 color-grey" @click="changeValue(1)">
      <icon-base class="box-40" ><icon-plus /></icon-base>
    </div>
  </div>
</template>

<script>

import IconBase from './IconBase'
import IconPlus from './icons/IconPlus'
import IconMinus from './icons/IconMinus'
import focus from '../util/functions.js'

export default {
  components: {
    IconBase,
    IconPlus,
    IconMinus,
  },
  props: {
    modelValue: Number,
    min: Number,
    max: Number,
  },
  data (){
    return{
      showedValue: this.min,
      actualValue: this.min
    }
  },
  mounted() {
    this.showedValue = this.modelValue;
  },
  watch: {
    showedValue (newVal){
      // bound the value
      newVal = this.boundValue(newVal);
      this.actualValue = parseInt(newVal);
      this.$emit('update:modelValue', this.actualValue);
    },
    modelValue (newVal){
        this.showedValue = newVal;
    }
  },
  methods: {
    changeValue(diff) {
      this.showedValue = this.boundValue(this.showedValue + diff);
    },
    updateVisible () {
      this.showedValue = this.actualValue;
    },
    boundValue (val) {
      if(val > this.max){
        return this.max;
      }
      if(val < this.min){
        return this.min;
      }
      return val;
    },
    focusNext(evt){
      focus.focusOnNextFormInput(evt.target);
    },
    focusPrev(evt){
      focus.focusOnPreviousFormInput(evt.target);
    }
  },
  emits: ['update:modelValue']
}
</script>

<style scoped>

.numeric-input{
  border-radius: 20px;
  border: 2px black solid;
  padding: 0;
  overflow: hidden;
}

input{
  border: none;
  border-radius: 0px;
  margin: 0;
  padding: 0 10px;
  font-size: 20px;
  width: 40px;
}
div:hover {
  cursor: pointer;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>