<template>
    <div class="flex flex-wrap gap-x-2">
        <div>
            <label class="text-gray-700">
                {{$t('labels.church')}}:
            </label>
            <label>
                {{filter.org}}
            </label>
        </div>
        <div v-if="filter.minAge || filter.maxAge">
            <label class="text-gray-700">
                {{$t('labels.age')}}:
            </label>
            <label v-if="!filter.maxAge">O</label>
            <label>
                {{filter.minAge}}
            </label>
            <label v-if="filter.minAge && filter.maxAge">-</label>
            <label v-if="!filter.minAge">U</label>
            <label>
                {{filter.maxAge}}
            </label>
        </div>
        <div>
            <label class="text-gray-700">
                {{$t('labels.role')}}:
            </label>
            <label>
                {{filter.role}}
            </label>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ParticipantFilters } from '../domain'

export default defineComponent({
    props: {
        filter: {type: Object as PropType<ParticipantFilters>, required: true}
    }
})
</script>
