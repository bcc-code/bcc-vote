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

import ArrowRightIcon from 'heroicons-vue3/outline/ArrowNarrowRightIcon'
import { Poll } from '../domain/Poll'

import { defineComponent, PropType } from 'vue'

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
        }
    },
    async created(){
        const answers = await this.$client.service('answer').find({
            query: {
                _from: this.poll._id
            }
        })
        this.votes = answers.length
        this.$client.service('answer').on('created', this.updateVotes)
    },
    methods: {
        updateVotes(data: any){
            if(data._from === this.poll._id)
                this.votes++
        }
    }
})
</script>
