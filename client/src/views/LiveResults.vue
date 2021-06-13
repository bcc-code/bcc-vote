<template>
    <div :class="pageColors.bg">
        {{answers}}
        <div class="max-w-5xl mx-auto px-4">
            <h3 :class="['font-bold px-4 py-6',pageColors.text]">{{pollingEvent.title}}</h3>
            <div class="form-section px-10 py-8">
                <h3 class="font-bold mt-1 mb-6">{{activePoll.title}}</h3>
                <div class="flex justify-between mb-4">
                    <h4 class="font-bold">Votes</h4>
                    <h4 class="font-bold text-blue-900">{{answerCount}} Count</h4>
                </div>
                <ProgressBars :sortedOptions="sortedOptions" :totalCount="answerCount" />
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import ProgressBars from '../components/results-progress-bars.vue'
import { PollingEventStatus, Answer } from '../domain'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { defineComponent } from 'vue'
export default defineComponent({
    components: {
        ProgressBars
    },
    data() {
        return {
        }
    },
    async created(){
        await this.loadAnswers()
        this.$client.service('answer').on('created', this.addAnswer)
    },
    computed: {
        ...mapGetters('result',['activePoll','sortedOptions','answerCount']),
        ...mapState('result', ['pollingEvent','polls','answers']),
        isEventLive(): boolean{
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
        ...mapActions('result',['loadAnswers']),
        addAnswer(answer: Answer) {
            console.log('ADd Answer',answer)
            this.ADD_ANSWER(answer)
        }
    }
})
</script>
