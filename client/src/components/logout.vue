<template>
    <button type="button" id="logout" @click="logout" class="h-full flex items-center rounded-xl border-2 border-black py-2 px-4">
        <h5 class="font-bold">{{$t('actions.logout')}}</h5>
    </button>
</template>


<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    methods: {        
        logout(){
            this.$router.push({name:'logout'})
        }
    },
})
</script>

