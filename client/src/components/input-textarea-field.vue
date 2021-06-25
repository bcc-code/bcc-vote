<template>
    <textarea v-model="model" ref="textArea">
    </textarea>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        modelValue: {type: String, required: true}
    },
    data(){
        return{
            paddingAndBorderVertical: 19.2
        }
    },
    computed: {
        textHeight():void{
            
        },
        model: {
            get():string{
                // this.$nextTick(() => {
                    
                //     console.log(this.$refs)
                // })
                return this.modelValue
            },
            set(newVal:string){
                this.$emit('update:modelValue', newVal);
            }
        }
    },
    emits: ['update:modelValue']
})
</script>


<style scoped>
    textarea {
        resize:none;
    }
</style>