<template>
  <div class="border rounded-md py-3 px-4">
    <div class="flex justify-between">
      <h4 class="font-bold">{{poll.title}}</h4>
      <router-link :to="`/poll/result/${poll._key}`">
        <ArrowRightIcon class="ml-4 w-6 h-6 text-blue-900 cursor-pointer"/>
      </router-link>
    </div>
    <label class="text-gray-700">{{$t('labels.poll-result-visibility.'+poll.resultVisibility)}} - {{votes}} {{$t('labels.votes')}}</label>
  </div>
</template>

<script lang="ts">

import ArrowRightIcon from 'heroicons-vue3/outline/ArrowNarrowRightIcon'
import { Poll, Answer } from '../domain/Poll'

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
    this.votes = answers.length;
    this.$client.service('answer').on('created', this.updateVotes);
  },
  methods: {
    updateVotes(data: any){
      if(data._from === this.poll._id)
        this.votes++;
    }
  }
})
</script>