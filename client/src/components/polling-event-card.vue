<template>
  <div class="px-4 py-6 border-2 border-gray-200 rounded-lg">
      <h3 class="font-bold">{{pollingEvent.title}}</h3>
      <div class="text-gray-700 mb-3 flex">
          <p v-if="pollingEvent.type">{{$t(`labels.${pollingEvent.type}-voting-event`)}}</p>
          <p v-if="pollingEvent.startDateTime">
              &nbsp -&nbsp
              {{new Date(pollingEvent.startDateTime).toLocaleDateString()}}
            </p>
        </div>
      <button class="w-32 h-5 font-bold text-blue-900 flex items-center justify-between" @click="goToPoll">
          {{$t('actions.go-to-poll')}}
          <ArrowRight class="h-full"/>
        </button>
  </div>
</template>

<script lang="ts">
import ArrowRight from 'heroicons-vue3/solid/ArrowNarrowRightIcon'
import { PollingEvent } from '../domain'
import { defineComponent, PropType } from 'vue'
export default defineComponent({
    components: {
        ArrowRight,
    },
    props: {
        pollingEvent: Object as PropType<PollingEvent>,
    },
    methods: {
        goToPoll() {
            this.$router.push({ path: `/polling-event/live/${this.pollingEvent._key}`, params: { id: this.pollingEvent._key}})
        }
    }
})
</script>
