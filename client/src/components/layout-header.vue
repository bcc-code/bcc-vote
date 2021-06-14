<template>
    <div class="pb-12">
        <nav class="flex flex-row-reverse justify-between items-center fixed left-0 w-full h-12 z-10 shadow-md bg-white px-3 md:px-6">
            <button class="profile-icon">
                <img src="../assets/profile.svg" />
                <div class="profile-dropdown dropdown-box">
                    <h6 class="text-gray-700">{{$t('labels.settings')}}</h6>
                    <h5 @click="openConnection = !openConnection">{{$t('labels.connection-status')}}</h5>
                    <h5 @click="logout">{{$t('actions.logout')}}</h5>
                </div>
            </button>
            <div v-if="!showingFooter" class="pl-5">
                <ArrowLeft class="cursor-pointer h-6 w-6 text-black" @click="navigateBack"/>
            </div>
        </nav>
        <div v-if="openConnection" class="dropdown-box absolute positioning p-3">
            <h4>Logging{{dots}}</h4>
            <h5>id: {{$client.io.io.engine.id}}</h5>
            <h5>connection: {{$client.io.connected}}</h5>
            <h5>ping timer: {{$client.io.io.engine.pingTimeoutTimer}}</h5>
            <h5>ready state: {{$client.io.io.engine.readyState}}</h5>
        </div>
    </div>
</template>
<script lang="ts">
import ArrowLeft from 'heroicons-vue3/outline/ArrowNarrowLeftIcon'
import { defineComponent } from 'vue'
export default defineComponent({
    components: {
        ArrowLeft
    },
    props: {
        showingFooter: { type: Boolean, required: true}
    },
    data(){
        return {
            openConnection: false as boolean,
            refreshCount: 0 as number
        }
    },
    computed: {
        dots():string{
            return '.'.repeat(this.refreshCount % 4)
        }
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
<style>
.profile-icon {
    @apply h-12;
    @apply w-12;
    @apply p-4;
    @apply relative;
}

.profile-icon:hover .profile-dropdown {
    @apply block;
}

.dropdown-box {
    background-color: #16171A;
    @apply text-white;
    @apply rounded-b-lg;
    width: max-content
}

.profile-dropdown {
    @apply hidden;
    @apply absolute;
    top: 48px;
    right: 16px;
    @apply text-left;
}

.profile-dropdown * {
    padding: 10px 16px;
}

.profile-dropdown h5:hover {
    background: rgba(96, 130, 206, 0.1);
}

.positioning {
    top: 48px;
    left: 16px;
}
</style>
