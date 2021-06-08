<template>
    <div class="pb-12">
        <nav class="flex justify-between items-center fixed left-0 w-full h-12 z-10 shadow-md bg-white">
            <div v-if="!showBCCLogo" class="pl-5">
                <ArrowLeft class="cursor-pointer h-6 w-6 text-blue-800" @click="navigateBack"/>
            </div>
            <div v-if="showBCCLogo" class="pl-5">
                
            </div>
            <div class="flex items-center py-2 pr-5">
                <LogInformation/> 
                <Logout/>  
            </div>          
        </nav>
    </div>
</template>

<script>
import LogInformation from './log-information'
import ArrowLeft from 'heroicons-vue3/outline/ArrowNarrowLeftIcon'
import Logout from './logout.vue'

import { defineComponent } from 'vue'

export default defineComponent({
    components: {
        LogInformation,
        ArrowLeft,
        Logout
    },
    computed: {
        showBCCLogo(){
            if(this.$route.path === "/")
                return true
            return false
        },
    },
    methods: {
        navigateBack(){
            this.$router.go(-1)
        },
        logout(){
            this.$router.push({name:'logout'})
        }
    }
})
</script>
