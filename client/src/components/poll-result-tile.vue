<template>
    <router-link :to="`/poll/result/${poll._key}`" class="border rounded-md py-3 px-4 cursor-pointer">
        <div class="flex justify-between">
            <h4 class="font-bold">{{poll.title}}</h4>
            <ArrowRightIcon class="ml-4 w-6 h-6 text-blue-900"/>
        </div>
        <label class="text-gray-700">{{$t('labels.poll-result-visibility.'+poll.resultVisibility)}} - {{votes}} {{$t('labels.votes')}}</label>
    </router-link>
</template>

<script lang="ts">

import ArrowRightIcon from 'heroicons-vue3/outline/ArrowNarrowRightIcon';
import { Poll } from '../domain/Poll';

import { defineComponent, PropType } from 'vue';

export default defineComponent({
    components: {
        ArrowRightIcon
    },
    props: {
        poll: {type: Object as PropType<Poll>, required: true }
    
    },
    data(){
        return{
            votes: 0,
            removeListeners: [] as (() => void)[]
        };
    },
    async created(){
        const startupDate = Date.now();
        const results = await this.$client.service('poll-result').get(this.poll._key);
        this.updateVotes(results);

        const pollResult = this.$firestore.collection('poll-result').where('lastChanged', '>=', startupDate);
        const unsubscribe = pollResult.onSnapshot((docSnapshot:any) => {
            docSnapshot.docChanges().forEach((change:any) => {
                if (change.type === 'modified') {
                    const data = change.doc.data();
                    data.firestore = true;
                    this.updateVotes(data);
                }
            });
        });
        this.removeListeners.push(unsubscribe);
    },
    unmounted(){
        this.removeListeners.forEach((unsubscribe) => unsubscribe());
    },
    methods: {
        updateVotes(data: any){
            if(!data) {
                return;
            }
            if(data.pollId !== this.poll._key)
                return;
            let count = 0;
            Object.keys(data.answerCount).forEach((key:string) => {
                count += data.answerCount[key];
            });
            this.votes = count;
        }
    }
});
</script>
