<template>
    <nav  v-if="isNav" class="flex justify-between items-center fixed left-0 w-full h-12 z-10 shadow-md bg-white">
        <div class="pl-8 w-40">
            <ArrowLeft class="cursor-pointer h-8" style="color:#838ca8;" @click="navigateBack"/>
        </div>
        <div class="pr-8 flex justify-end" style="width: 10rem"> 
        </div>     
    </nav>
</template>

<script>

import loadjs from "loadjs"

import ArrowLeft from 'heroicons-vue3/outline/ArrowNarrowLeftIcon'

export default {
    components: {
        ArrowLeft,
    },
    props: {
        isNav: Boolean,
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
}
</script>