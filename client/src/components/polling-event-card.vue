<template>
    <div>
        <div class="p-4 h-full flex flex-col justify-between border-2 border-gray-200 rounded-lg shadow-base">
            <div>
                <div class="flex items-start justify-between mb-2">
                    <div>
                        <label class="text-gray-700">{{formattedDate}}</label>
                        <h3 class="font-bold">{{pollingEvent.title}}</h3>
                    </div>
                    <EventStatus :status="pollingEvent.status" />
                </div>
                <p v-if="pollingEvent.description" class="text-gray-700 text-limit-2 mb-2">{{pollingEvent.description}}</p>
            </div>
            <div class="flex flex-col gap-6 items-center mb-3 mt-7">
                <button  v-if="isCreator" class="md-button font-bold rounded-full text-white bg-blue-900" @click="goToAdmin">
                    {{$t(`actions.admin-this-event`)}}
                </button>
                <button v-if="canParticipate" class="font-bold rounded-full" :class="isCreator ? 'text-blue-900':'md-button text-white bg-blue-900'" @click="showConfirm = true">
                    {{$t(`actions.join-this-event`)}}
                </button>
            </div>
        </div>
        <transition name="fade">
            <ConfirmPopover v-if="showConfirm" @resign="showConfirm = false" @cancel="$logout()" @confirm="goToLobby()" cancelTranslation="logout" confirmTranslation="ok-continue">
                <template v-slot:header>
                    {{$t('labels.logged-as')}}
                    <span class="text-blue-900 block md:inline-block">{{$user.displayName}}</span>
                </template>
                <template v-slot:description>
                    {{$t('info.not-you')}}
                </template>
            </ConfirmPopover>
        </transition>
    </div>
</template>

<script lang="ts">
import ConfirmPopover from './confirm-popover.vue';
import EventStatus from './polling-event-status.vue';

import { PollingEvent, PollingEventStatus } from '../domain';
import { defineComponent, PropType } from 'vue';
import moment from 'moment';
export default defineComponent({
    components: {
        ConfirmPopover,
        EventStatus
    },
    props: {
        pollingEvent: { type: Object as PropType<PollingEvent>, required: true }
    },
    data () {
        return {
            showConfirm: false,
        };
    },
    computed: {
        isEventNotStarted():boolean {
            return this.pollingEvent.status === PollingEventStatus['Not Started'];
        },
        isEventLive():boolean {
            return this.pollingEvent.status === PollingEventStatus['Live'];
        },
        formattedDate():string {
            return moment(this.pollingEvent.startDateTime).format("MMMM D, HH:mm");
        },
        canParticipate():boolean{
            if(this.pollingEvent.status === PollingEventStatus['Finished'])
                return false;
            if(this.pollingEvent.status === PollingEventStatus['Archived'])
                return false;
            const rolesEnum: string[] = this.$user.roles.map((r:any) => r.enumName);
            const filter = this.pollingEvent.participantFilter;
            if(filter.maxAge && this.$user.age >= filter.maxAge)
                return false;
            if(filter.minAge && this.$user.age < filter.minAge)
                return false;
            if(filter.org !== 'all' && this.$user.churchID.toString() !== filter.org)
                return false;
            if(filter.role !== 'all' && !rolesEnum.includes(filter.role))
                return false;
            return true;
        },
        isCreator():boolean{
            return this.$user.personID === this.pollingEvent.creatorId;
        }
    },
    methods: {
        goToLobby() {
            this.$router.push(`/polling-event/lobby/${this.pollingEvent._key}`);
        },
        goToAdmin() {
            this.$router.push(`/polling-event/admin/${this.pollingEvent._key}`);
        }
    }
});
</script>

<style scoped>
.text-limit-2 {
   overflow: hidden;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 2;
   -webkit-box-orient: vertical;
}
</style>
