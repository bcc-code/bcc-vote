<template>
    <div :class="pageColors.bg">
        <Spinner v-if="loading"/>
        <div v-else class="max-w-5xl mx-auto px-4">
            <h3 :class="['font-bold px-4 py-6',pageColors.text]">{{pollingEvent.title}}</h3>
            <div v-if="activePoll" class="form-section px-10 py-8">
                <h3 class="font-bold mt-1 mb-6">{{activePoll.title}}</h3>
                <div class="flex justify-between mb-4">
                    <h4 class="font-bold">Votes</h4>
                    <h4 class="font-bold text-blue-900">{{answerCount}} Count</h4>
                </div>
                <ProgressBars class="mb-8" :sortedOptions="sortedOptions" :totalCount="answerCount" />
                <h4 class="font-bold mb-3">Deltaker</h4>
                <div class="w-full">
                    <transition-group name="list" tag="div" class="flex flex-wrap -mx-2">
                        <div v-for="answer in answers" :key="answer._id" class="w-1/3 p-2">
                            <div class="answer-box">
                                <div class="p-2">
                                    <h4 class="font-bold">{{answer.displayName}}</h4>
                                </div>
                                <div class="flex items-center px-4 rounded-r-lg" :style="`background-color:${sortedOptions[answer.answerId].bgColor}`">
                                    <h4 class="font-bold text-white">Ja</h4>
                                </div>
                            </div>
                        </div>
                    </transition-group>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import ProgressBars from '../components/results-progress-bars.vue'
import { Poll, PollingEventStatus, Answer } from '../domain'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { defineComponent } from 'vue'
export default defineComponent({
    components: {
        ProgressBars
    },
    data() {
        return {
            loading: false
        }
    },
    async created(){
        this.loading = true
        const pollingEventKey = this.$route.params.id
        await this.getPollingEvent(pollingEventKey)
        this.loading = false
        this.$client.service('answer').on('created', this.ADD_ANSWER)
        this.$client.service('poll').on('patched', this.patchedPoll)
        this.$client.io.on('reconnect', this.loadResults)
    },
    computed: {
        ...mapGetters('result',['activePoll','sortedOptions','answerCount']),
        ...mapState('result', ['pollingEvent','polls','answers']),
        isEventLive(): boolean {
            return this.pollingEvent && this.pollingEvent.status === PollingEventStatus['Live']
        },
        pageColors(): {bg:string, text:string} {
            return this.isEventLive ? {
                bg: 'bg-blue-900',
                text: 'text-white'
            } : {
                bg: 'bg-gray-100',
                text: 'text-blue-900'
            }
        }
    },
    methods: {
        ...mapMutations('result',['ADD_ANSWER']),
        ...mapActions('result',['getPollingEvent','findAnswers','patchedPoll']),
        async loadResults() {
            this.loading = true
            await this.findAnswers()
            this.loading = false
        }
    },
    watch: {
        activePoll(newPoll:Poll, oldPoll:Poll) {
            if(newPoll && (!oldPoll || newPoll._id !== oldPoll._id)) {
                this.loadResults()
            }
        }
    }
})
</script>
<style scoped>
.answer-box {
    @apply flex;
    @apply justify-between;
    border-width: 1.5px;
    border-style: solid;
    @apply border-gray-500;
    @apply rounded-lg;
}
</style>
