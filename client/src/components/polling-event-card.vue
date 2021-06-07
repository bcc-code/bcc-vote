<template>
    <div class="p-4 border-2 border-gray-200 rounded-lg shadow-base" :class="{'cursor-pointer': !isEventFinished}" @click="goToEvent()">
        <div class="flex items-center justify-between mb-2">
            <div>
                <label>{{formattedDate}}</label>
                <h3 class="font-bold">{{pollingEvent.title}}</h3>
            </div>
            <div :class="['px-6 py-1 mr-1 rounded-lg',statusColors[pollingEvent.status]]">
                <h4 class="font-bold">{{$t(`labels.polling-event-status.${pollingEvent.status}`)}}</h4>
            </div>
        </div>
        <p class="text-gray-700 mb-10">{{pollingEvent.description}}</p>
        <div v-if="!isEventFinished" class="flex justify-center mb-3">
            <button class="gradient-button md-button">
                <template v-if="$user.personID === pollingEvent.creatorId" >
                {{$t(`actions.admin-this-event`)}}
                </template>
                <template v-else>
                    {{$t(`actions.join-this-event`)}}
                </template>
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { PollingEvent, PollingEventStatus } from '../domain'
import { defineComponent, PropType } from 'vue'
import moment from 'moment'
export default defineComponent({
    props: {
        pollingEvent: { type: Object as PropType<PollingEvent>, required: true }
    },
    data () {
        return {
            statusColors: {
                'live':'text-red-600 bg-red-200',
                'not_started':'text-bland-green bg-bland-green',
                'finished':'text-gray-700 bg-gray-200'
            }
        }
    },
    computed: {
        isEventFinished():boolean {
            return this.pollingEvent.status === PollingEventStatus['Finished'];
        },
        formattedDate():string {
            let date = ''
            if(this.pollingEvent && this.pollingEvent.startDateTime) {
                const day = moment(this.pollingEvent.startDateTime).format('MMMM D')
                const time = moment(this.pollingEvent.startDateTime).format('hh:mm')
                date = day + ' , ' + time
            }
            return date
        }
    },
    methods: {
        goToEvent() {
            if(this.isEventFinished)
                return
            if (this.$user.personID === this.pollingEvent.creatorId)
                this.$router.push(`/polling-event/admin/${this.pollingEvent._key}`);
            else
                this.$router.push(`/polling-event/lobby/${this.pollingEvent._key}`);
        }
    }
})
</script>
