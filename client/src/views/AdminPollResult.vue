<template>
    <div class="max-w-5xl mx-auto py-6 px-4">
        <Spinner v-if="!loaded" />
        <div v-else class="form-section p-4 md:p-12">
            <h3 class="font-bold mb-2">{{poll.title}}</h3>
            <PollResults :poll="poll" isEventCreator/>
        </div>
    </div>
</template>
<script lang="ts">
import PollResults from '../components/poll-results.vue';
import {defineComponent} from 'vue';
import { Poll } from '../domain';
export default defineComponent({
    components: {
        PollResults
    },
    data(){
        return{
            loaded: false as boolean,
            poll: {} as Poll,
        };
    },
    created(){
        this.loadPoll();
        
        this.$client.io.on('reconnect', this.loadPoll);
    },
    unmounted(){
        this.$client.io.off('reconnect', this.loadPoll);
    },
    methods: {
        async loadPoll(){
            this.loaded = false;
            await this.$client.service('poll').get(this.$route.params.id)
                .then((res: Poll) => {
                    this.poll = res;
                }).catch(this.$handleError);
            this.loaded = true;
        }
    }
});
</script>
