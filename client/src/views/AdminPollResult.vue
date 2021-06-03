<template>
    <div>
        <PollResults v-if="loaded" :poll="poll"/>
    </div>
</template>
<script lang="ts">
import PollResults from '../components/poll-popover-results.vue'
import {defineComponent} from 'vue'
import { Poll } from '../domain'
export default defineComponent({
    components: {
        PollResults
    },
    data(){
        return{
            loaded: false as boolean,
            poll: {} as Poll,
        }
    },
    async created(){
        await this.loadPoll()
        this.loaded = true
    },
    methods: {
        async loadPoll(){
            await this.$client.service('poll').get(this.$route.params.id)
                .then((res: Poll) => {
                    this.poll = res
                }).catch(this.$showError)
        }
    }
})
</script>
