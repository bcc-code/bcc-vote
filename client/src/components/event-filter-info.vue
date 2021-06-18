<template>
    <div class="flex flex-wrap gap-x-2 text-xl">
        <div>
            <span class="text-gray-700">
                {{$t('labels.church')}}:
            </span>
            <span>
                {{filter.org}}
            </span>
        </div>
        <div v-if="filter.minAge || filter.maxAge">
            <span class="text-gray-700">
                {{$t('labels.age')}}:
            </span>
            <span v-if="!filter.maxAge">O</span>
            <span>
                {{filter.minAge}}
            </span>
            <span v-if="filter.minAge && filter.maxAge">-</span>
            <span v-if="!filter.minAge">U</span>
            <span>
                {{filter.maxAge}}
            </span>
        </div>
        <div>
            <span class="text-gray-700">
                {{$t('labels.role')}}:
            </span>
            <span>
                {{filter.role}}
            </span>
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
