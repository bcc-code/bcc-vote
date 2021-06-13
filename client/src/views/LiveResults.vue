<template>
    <div :class="pageColors.bg">
        {{activePoll}}
        <div class="max-w-5xl mx-auto px-4">
            <h3 :class="['font-bold px-4 py-6',pageColors.text]">{{pollingEvent.title}}</h3>
            <div class="form-section px-10 py-8">
                <h3 class="font-bold mt-1 mb-6">{{activePoll.title}}</h3>
                <div class="flex justify-between mb-4">
                    <h4 class="font-bold">Votes</h4>
                    <h4 class="font-bold text-blue-900">12 Count</h4>
                </div>
                <ProgressBars :sortedOptions="sortedOptions" :totalCount="0" />
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import ProgressBars from '../components/results-progress-bars.vue'
import { PollingEventStatus } from '../domain'
import { mapState, mapGetters } from 'vuex'
import { defineComponent } from 'vue'
export default defineComponent({
    components: {
        ProgressBars
    },
    data() {
        return {
        }
    },
    created(){
    },
    computed: {
        ...mapGetters('result',['activePoll','sortedOptions']),
        ...mapState('result', ['pollingEvent','polls']),
        isEventLive(): boolean{
            return this.pollingEvent && this.pollingEvent.status === PollingEventStatus['Live']
        },
        pageColors(): {bg:string, text:string} {
            return this.isEventLive ? {
                bg: 'bg-blue-900',
                text: 'text-white'
            }: {
                bg: 'bg-gray-100',
                text: 'text-blue-900'
            }
        }
    },
})
</script>
