<template>
    <div :class="pageColors.bg">
        <Spinner v-if="loading"/>
        <div v-else class="max-w-5xl mx-auto px-4">
            <h3 :class="['font-bold px-4 py-6',pageColors.text]">{{pollingEvent.title}}</h3>
            <div v-if="activePoll" class="form-section px-10 py-8">
                <h3 class="font-bold mt-1 mb-6">{{activePoll.title}}</h3>
                <div class="flex justify-between mb-4">
                    <h4 class="font-bold">{{$t('labels.votes')}}</h4>
                    <h4 class="font-bold text-blue-900">{{answerCount + ' ' + $t('labels.count')}}</h4>
                </div>
                <ProgressBars class="mb-8" :sortedOptions="sortedOptions" :totalCount="answerCount" v-model="selectedOption" :visibleResults="resultsVisible"/>
                <h4 class="font-bold mb-3">{{$t('labels.participants')}}</h4>
                <div v-if="resultsVisible" class="w-full">
                    <AdminVoterList :sortedOptions="sortedOptions" :voterList="voterList"/>
                </div>
                <InfoBox v-else>{{$t('info.poll-is.'+activePoll.resultVisibility)}}</InfoBox>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import ProgressBars from '../components/results-progress-bars.vue'
import AdminVoterList from '../components/admin-voter-list.vue'
import { Poll, PollingEventStatus, PollResultVisibility, Answer } from '../domain'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { defineComponent } from 'vue'
export default defineComponent({
    components: {
        ProgressBars,
        AdminVoterList
    },
    data() {
        return {
            loading: false,
            selectedOption: "",
        }
    },
    async created(){
        await this.init()
        
        this.$client.service('poll').on('patched', this.patchedPoll)
        this.$client.service('poll-result').on('patched', this.UPDATE_POLL_RESULT)
        this.$client.service('answer').on('created', this.ADD_ANSWER)
    
        this.$client.io.on('reconnect', this.init)
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
        },
        resultsVisible():boolean {
            let visible = false
            if(this.activePoll && this.activePoll.resultVisibility === PollResultVisibility['Public']) {
                visible = true
            }
            return visible
        },
        voterList():Array<Answer>{
            if(this.selectedOption){
                return this.answers.filter((ans: Answer) => {
                    return ans.answerId == this.selectedOption
                })
            }
                
            return this.answers

        }
    },
    methods: {
        ...mapMutations('result',['ADD_ANSWER','UPDATE_POLL_RESULT']),
        ...mapActions('result',['getPollingEvent', 'getPollResult', 'findPolls','findAnswers','patchedPoll']),
        async init() {
            this.loading = true
            const pollingEventKey = this.$route.params.id
            try {
                await this.getPollingEvent(pollingEventKey)
                await this.findPolls()
                if(this.activePoll) {
                    await this.getPollResult()
                    await this.findAnswers()
                }
            } catch(err) {
                this.$showError(err)
            }
            this.loading = false
        },
        async refreshAnswers() {
            this.loading = true
            try {
                await this.findAnswers()
            } catch(err) {
                this.$showError(err)
            }
            this.loading = false
        }
    },
    watch: {
        activePoll(newPoll:Poll, oldPoll:Poll) {
            if(newPoll && (!oldPoll || newPoll._id !== oldPoll._id)) {
                this.refreshAnswers()
            }
        }
    }
})
</script>

