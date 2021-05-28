<template>
    <nav  v-if="isNav" class="flex justify-between items-center fixed left-0 w-full h-12 z-10 shadow-md bg-white">
        <div class="pl-8 w-40">
            <i class="cursor-pointer fas fa-long-arrow-alt-left" style="color:#838ca8;" @click="navigateBack">aabb</i>
        </div>
        <div class="pr-8 flex justify-end" style="width: 10rem">
            <button type="button" id="logout" @click="logout" class="hidden sm:flex items-center justify-center btn-teal rounded-xl py-1 px-4">
                <i class="cursor-pointer fas fa-sign-out-alt pr-3" style="color:#ffffff;" @click="navigateBack">abd</i>
            </button>  
        </div>     
    </nav>
</template>

<script>

import loadjs from "loadjs"
export default {
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