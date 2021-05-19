<template>
  <div id="pop-up">
    <div class="horizontal space-out center-line color-grey padding-all-20">
      <h2>{{text}}</h2>
      <icon-base class="rounded box-40 color-red clickable" @click="$emit('close')"><icon-cross /></icon-base>
    </div>
    <slot>
    </slot>
  </div>
</template>
<script>

import IconBase from '../components/IconBase'
import IconCross from '../components/icons/IconCross'

export default {
  components:{
    IconBase,
    IconCross
  },
  props:{
    text: String
  },
  emits: ['close']
}
</script>
<style scoped>
  #pop-up{
    position: absolute;
    z-index: 100;
    top: 30%;
    left: 50%;
    background-color: white;
    transform: translateX(-50%);
    box-shadow: 0px 0px 20px 20px;
    /* transform: translateX(-50%); */
  }
</style>