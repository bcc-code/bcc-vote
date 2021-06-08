<template>
   <div class="pr-8 flex justify-end" style="width: 10rem">
                <button type="button" id="logout" @click="logout" class="hidden sm:flex items-center justify-center btn-teal rounded-xl py-1 px-4">
                    <i class="cursor-pointer fas fa-sign-out-alt pr-3" style="color:#ffffff;" @click="navigateBack"></i> 
                    {{$t('actions.logout')}}
                </button>  
        </div>    
</template>


<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
 
    data(){
        return {
         
        }
    },
   methods: {        
        logout(){
            this.$router.push({name:'logout'})
        }
    },
})
</script>

