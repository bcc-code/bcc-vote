<template>
  <div>
        <div class="h-4"></div>
        <div class="flex justify-center items-center w-full background-home h-60 sm:h-128">
            <div class="max-w-md text-center text-blue-900 pt-12 sm:pt-32">
                <h1 class="font-bold pb-5">BCC Voting</h1>
                <p class="hidden sm:block">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <router-link to="/create">
                    <grad-button class="text-2xl sm:text-base sm:mt-4">
                        Create a voting event
                    </grad-button>
                </router-link>
            </div>
        </div>
        <div class="flex py-4 gap-6 text-gray-700  font-bold justify-center cursor-pointer">
            <h3 :class="{'text-blue-900': currentTab==='events'}" @click="currentTab='events'">Voting events</h3>
            <h3 :class="{'text-blue-900': currentTab==='history'}" @click="currentTab='history'">History</h3>
        </div>
        <info v-if="meetings.length == 0">
            There are no meetings currently available
        </info>
  </div>
</template>

<script>

import GradButton from '../components/GradButton'
import Info from '../components/Info'

export default {
    components: {
        GradButton,
        Info,
    },
    props: {
        mobile: Boolean,
    },
    data () {
        return {
            currentTab: 'events',
            meetings: [],
        }
    },
}
</script>

<style scoped>
</style>
