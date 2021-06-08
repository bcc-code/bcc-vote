<template>
    <div  >
        <nav class="flex justify-between items-center fixed left-0 w-full h-12 z-10 shadow-md bg-white">
            <div  v-if="!showBCCLogo" class="pl-5">
                <ArrowLeft class="cursor-pointer h-6 w-6 text-blue-800" @click="navigateBack"/>
            </div>
            <div  v-if="showBCCLogo" class="pl-5">
            </div>
            <div class="flex items-center py-2 pr-5">
                <LogInformation/> 
                <Logout/>  
            </div>          
        </nav>
        <div class="h-12"></div>
    </div>
</template>

<script>
import LogInformation from './log-information'
import ArrowLeft from 'heroicons-vue3/outline/ArrowNarrowLeftIcon'
import Logout from './logout.vue'

import { defineComponent } from 'vue'
import loadjs from "loadjs"

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
        initTopbar() {
            var scriptId = "script-bcc-topbar"
            if (document.getElementById(scriptId) == null) {
                var scriptPath = "https://widgets.bcc.no/widgets/TopbarJs"
                loadjs([scriptPath,"https://widgets.bcc.no/styles/widgets.css"], {
                    async: true,
                    error: function (path) {
                        console.error('could not load resource: ' + path)
                    },
                    before: function (path, element) {
                        if(path === scriptPath ){
                            element.id = scriptId
                            element.setAttribute("data-authentication-type", "SPA")
                            element.setAttribute(
                                "data-authentication-location",
                                "feathers-jwt"
                            )
                        }
                    }
                })
            }
        },
        navigateBack(){
            this.$router.go(-1)
        },
        logout(){
            this.$router.push({name:'logout'})
        }
    },
    mounted: function(){
        this.initTopbar()
    },
})
</script>
