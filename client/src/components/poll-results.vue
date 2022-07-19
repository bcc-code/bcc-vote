<template>
    <div v-if="loaded" class="h-full">
        <div v-if="pollResultsAreVisible" class="text-gray-700 text-xl pb-4">{{$t('info.select-option')}}</div>
        <div v-if="loaded" class="pt-4">
            <ProgressBars :sortedOptions="sortedOptions" :totalCount="totalCount" :chosenOption="chosenOption" v-model="selectedOption" :visibleResults="pollResultsAreVisible"/>
            <div class="py-5">
            <div v-if="pollResultsAreVisible">
                <h5 class="font-bold mb-3 text-gray-600">{{$t('labels.participants')}}</h5>
                <VoterList :voterList="voterList" :sortedOptions="sortedOptions"/>
            </div>
            <InfoBox v-else>{{$t('info.poll-is.'+poll.resultVisibility)}}</InfoBox>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import ProgressBars from '../components/results-progress-bars.vue';
import VoterList from './results-voter-list.vue';

import { Poll, PollResultVisibility, Answer, Option, SortedOptions, PollResult } from '../domain';
import { defineComponent, PropType } from 'vue';
// import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default defineComponent({
    components: {
        ProgressBars,
        VoterList
    },
    props: {
        poll: {type: Object as PropType<Poll>, required: true},
        chosenOption: {type: String},
        isEventCreator: {type: Boolean, default: false},
    },
    data() {
        return {
            disapearTime: 5000,
            selectedOption: "",
            loadedAllAnswers: false,
            loaded: false as boolean,
            allAnswers: [] as Array<Answer>,
            answerIdsFromFind: new Set as Set<string>,
            answerColors: ['#004C78','#006887','#0081A2','#329BBD','#55B6D9','#72D0E3'],
            neutralColor: '#C1C7DA',
            sortedOptions: {} as SortedOptions,
            removeListeners: [] as (() => void)[]
        };
    },
    async created(){
        const startupDate = Date.now();
        this.generateSortedOptions();

        await this.init();
        
        if(this.pollResultsAreVisible) {
            const answer = this.$firestore.collection('answer').where('lastChanged', '>=', startupDate);
            const unsubscribeAnswer = answer.onSnapshot((docSnapshot:any) => {
                docSnapshot.docChanges().forEach((change:any) => {
                    if (change.type === 'added') {
                        const data = change.doc.data();
                        data.firestore = true;
                        this.addAnswer(data);
                    }
                });
            });
            this.removeListeners.push(unsubscribeAnswer);
        }

        const pollResult = this.$firestore.collection('poll-result').where('lastChanged', '>=', startupDate);
        const unsubscribePoll = pollResult.onSnapshot((docSnapshot:any) => {
            docSnapshot.docChanges().forEach((change:any) => {
                if (change.type === 'modified') {
                    const data = change.doc.data();
                    data.firestore = true;
                    this.changeBars(data);
                }
            });
        });
        this.removeListeners.push(unsubscribePoll);

        this.$client.io.on('reconnect', this.init);
    },
    unmounted(){
        this.removeListeners.forEach((unsubscribe) => unsubscribe());
        this.$client.io.off('reconnect', this.init);
    },
    watch: {
        selectedOption(newVal){
            if(newVal && !this.loadedAllAnswers){
                this.loadAllAnswers(this.poll);
            }
        }
    },
    computed: {
        // ...mapGetters('result',['activePoll','sortedOptions','answerCount']),
        totalCount():number {
            let sum = 0;
            Object.keys(this.sortedOptions).forEach((opt: string)=> {
                sum += this.sortedOptions[opt].count;
            });
            return sum;
        },
        pollResultsAreVisible():boolean {
            if(this.poll.resultVisibility === PollResultVisibility['Public'])
                return true;
            if(this.poll.resultVisibility === PollResultVisibility['Anonymous'])
                return false;
            if(this.isEventCreator)
                return true;
            return false;
        },
        voterList():Array<Answer>{
            if(this.selectedOption){
                return this.allAnswers.filter((v:Answer)=>{
                    return v.answerId === this.selectedOption;
                });
            }
            return this.allAnswers;
        }
    },
    methods: {
        async init(){
            this.loaded = false;
            this.loadedAllAnswers = false;

            let promises = [];

            promises.push(this.loadBars(this.poll));
            if(this.pollResultsAreVisible)
                promises.push(this.loadAllAnswers(this.poll));

            await Promise.all(promises);
            this.loaded = true;
        },
        async loadBars(poll:Poll){
            const pollResults = await this.$client.service('poll-result').get(poll._key).catch(this.$handleError);
            this.changeBars(pollResults);
        },
        async loadAllAnswers(poll:Poll){
            const res = await this.$client.service('answer').find({
                query: {
                    _from: poll._id,
                    $sort: {
                        lastChanged: -1
                    }
                }
            }).catch(this.$handleError);
            this.loadedAllAnswers = true;
            this.allAnswers = res;
            this.answerIdsFromFind = new Set(res.map((ans: Answer) => ans._key));
        },
        isVoterAlreadyCounted(key: string){
            return this.answerIdsFromFind.has(key);
        },
        addAnswer(answer: Answer){
            if(answer._from !== this.poll._id)
                return;
            if(this.isVoterAlreadyCounted(answer._key))
                return;

            this.allAnswers.unshift(answer);
        },
        changeBars(data: PollResult){
            if(!data || data.pollId !== this.poll._key)
                return;
            Object.keys(this.sortedOptions).forEach((ans: string) =>{
                this.sortedOptions[ans].count = data.answerCount[ans];
            });
        },
        generateSortedOptions(){
            this.sortedOptions = {} as SortedOptions;
            let colorIndex = 0;
            this.poll.answers.forEach((option: Option) => {
                this.sortedOptions[option.answerId] = {
                    count: 0,
                    bgColor: this.answerColors[colorIndex],
                    ...option
                };
                colorIndex++;
                if(colorIndex >= this.answerColors.length)
                    colorIndex = 0;
            });
            if(this.poll.answers.length > 2) {
                const lastAnswer = this.poll.answers[this.poll.answers.length - 1];
                this.sortedOptions[lastAnswer.answerId].bgColor = this.neutralColor;
            }
        }
    }

});
</script>
