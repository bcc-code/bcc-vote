<template>
    <div class="max-w-5xl mx-auto">
        <div class="w-full h-full px-4 py-8">
            <div class="form-section padding-md mb-10">
                <div class="flex justify-between items-center mb-5">
                <h2 class="font-bold">{{pollingEvent.title}}</h2>
                <PencilIcon @click="editPollingEvent(pollingEvent._key)" class="text-blue-900 cursor-pointer h-5"/>
                </div>
                <p class="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce pretium porta interdum. Ut felis diam, tristique in tellus et, maximus molestie eros.</p>
                <div class="w-full flex justify-center mt-8">
                <button class="gradient-button md-button text-lg" @click="closePollingEvent(pollingEvent._key)">{{$t('actions.close-live-poll')}}</button>
                </div>
            </div>
            <div class="form-section padding-md">
                <div class="flex justify-between">
                    <h3 class="font-bold">{{$t('question-queue')}}</h3>
                </div>
                <InfoBox class="m-4">{{$t('info.polls-activation-explaination')}}</InfoBox>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import InfoBox from '../components/info-box.vue'
import PencilIcon from 'heroicons-vue3/outline/PencilIcon'
import { defineComponent } from 'vue'
export default defineComponent({
    components: {
        InfoBox,
        PencilIcon
    },
    data() {
        return {
            currentTab: 'polls' as string,
            pollingEvent: {
                _id: '',
                _key: '',
                title: "Yearly Meeting",
                description: "Yearly Meeting in Oslo",
                type: "poll",
                creatorId: "person/122324242",
                startDateTime: null,
                participantFilter: {
                    orgs: [],
                    roles: [],
                    minAge: 10,
                    maxAge: 100
                }
            }
        }
    },
    methods: {
        editPollingEvent(pollingEventKey:string) {
            this.$router.push({ path: 'edit-polling-event', params: { id: pollingEventKey } })
        },
        closePollingEvent(pollingEventKey:string) {
            this.$router.push({ path: `/polling-event/prepare/${pollingEventKey}`, params: { id: pollingEventKey}})
        }
    }
})
</script>