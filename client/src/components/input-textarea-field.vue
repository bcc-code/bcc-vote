<template>
    <textarea v-model="model" ref="textArea" @change="setHeight" @keydown.enter.prevent="clickEnter()">
    </textarea>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        modelValue: {type: String, required: true},
        baseHeight: {type: String, required: true},
        enableNewLine: {type: Boolean, required: true}
    },
    data(){
        return{
            paddingAndBorderVertical: 19.2
        }
    },
    computed: {
        model: {
            get():string{
                // timeout is so that the height change happens after the text is rendered
                this.adjustHeight()
                
                return this.modelValue
            },
            set(newVal:string){
                this.$emit('update:modelValue', newVal)
            }
        }
    },
    methods: {
        clickEnter(){
            if(this.enableNewLine)
                this.model += '\n'
        },
        adjustHeight(){
            setTimeout(() => {
                const element = this.$refs.textArea as HTMLFormElement
                if(!element)
                    return
                element.style.height = this.baseHeight
                element.style.height = (element.scrollHeight) +'px'
            }, 0)
        }
    },
    emits: ['update:modelValue']
})
</script>


<style scoped>
    textarea {
        resize:none;
        overflow:hidden;
    }
</style>
