<template>
    <div class="px-5 py-3">
        <h3 class="font-bold mb-6">
            {{pollingEvent ? $t(`labels.edit-polling-event`): $t(`labels.new-polling-event`)}}
        </h3>
        <InfoBox class="mb-8">
            {{$t('info.define-group')}}
        </InfoBox>
        <FormField v-model="eventData.title" translation="polling-event-title"/>

        <FormField v-model="eventData.description" translation="poll-description" optional/>

        <FormField v-model="eventData.startDateTime" translation="poll-date" type="date" optional/>

        <h3 class="font-bold mt-10 mb-5">{{$t('fields.group')}}</h3>

        <InfoBox class="mb-8">
            {{$t('info.define-group')}}
        </InfoBox>

        <FormField v-model="eventData.participantFilter.org" translation="poll-church" type="select" :options="allChurches"/>

        <div class="flex w-full gap-10 max-w-sm">
            <FormField class="flex-grow" v-model="eventData.participantFilter.minAge" translation="poll-min-age" type="number" optional />
            <FormField class="flex-grow" v-model="eventData.participantFilter.maxAge" translation="poll-max-age" type="number" optional />
        </div>

        <FormField v-model="eventData.participantFilter.role" type='select' translation="poll-roles" :options="allRoles"/>

        <div v-if="numberOfVoters" class="flex justify-between py-4 font-bold items-center">
            <div>
                <h6>{{$t('info.number-of-participants')}}</h6>
                <h3>{{numberOfVoters}} {{$t('labels.voters')}}</h3>
            </div>
            <div>
                <div class="light-button text-lg cursor-pointer">{{$t('actions.show-all-participants')}}</div>
            </div>
        </div>

        <div class="flex justify-center py-5 gap-5 sm:mt-4">
            <h5 @click="$emit('close')" class="md-button text-gray-800 font-bold cursor-pointer">{{$t('actions.discard')}}</h5>
            <h5 class="primary-button md-button cursor-pointer" @click="sendPollingEvent">
                {{pollingEvent? $t('actions.save-changes'):$t('actions.create-polling-event')}}
            </h5>
        </div>
    </div>
</template>

<script lang="ts">
import InfoBox from '../components/info-box.vue';
import FormField from '../components/form-field.vue';
import XIcon from 'heroicons-vue3/outline/XIcon';

import { PollingEvent, PollingEventType, PollingEventStatus, ParticipantFilters } from '../domain';

interface RoleName {
    name: string,
    enumName: string,
}
interface Org {
    name: string,
    orgID: number
}
interface SelectObject {
    name: string,
    val: string|number
}

import { defineComponent, PropType } from 'vue';
export default defineComponent({
    components: {
        InfoBox,
        FormField,
    },
    props: {
        pollingEvent: Object as PropType<PollingEvent>,
    },
    data(){
        return {
            allChurches: [] as SelectObject[],
            allRoles: [] as SelectObject[],
            numberOfVoters: 0,
            eventData: {
                title: '',
                description: '',
                type: PollingEventType['Live Event'],
                status: PollingEventStatus['Not Started'],
                startDateTime: new Date(0),
                creatorId: 0,
                participantFilter: {
                    org: 'all',
                    role: 'all',
                    minAge: undefined,
                    maxAge: undefined,
                } as ParticipantFilters,
                participantLabels: {} as ParticipantFilters,
            } as PollingEvent,
        };
    },
    async created(){
        if(this.pollingEvent){
            this.eventData = JSON.parse(JSON.stringify(this.pollingEvent));
            this.eventData.startDateTime = new Date(this.eventData.startDateTime);
        }   
        await this.loadOrgs();
        await this.loadRoles();
    },
    computed: {
        votingAdminRole():any {
            if(this.$user.activeRole === 'VotingAdmin') {
                const role = this.$user.roles.filter((r:any) => r.enumName == 'VotingAdmin')[0];
                return role;
            } else {
                return false;
            }
        }
    },
    methods: {
        async loadOrgs(){
            let query = {
                activeStatusCode: 0,
                type: 'church',
                $select: ['name', 'orgID'],
                $sort: {
                    name: 1
                }
            } as any;
            if(this.votingAdminRole) {
                query.orgID = { $in: this.votingAdminRole.orgIDs};
            }
            const res = await this.$client.service('org').find({query}).catch(this.$handleError);
            
            if(!this.votingAdminRole) {
                res.unshift({name: "All churches", churchID: 'all'});
            }

            this.allChurches = res.map((c: Org) => {
                return {
                    name: c.name,
                    val: c.orgID.toString(),
                };
            });
        },
        async loadRoles(){
            const res = await this.$client.service('role').find({
                query: {
                    $sort: {
                        name: 1
                    },
              
                    $select: ['name', 'enumName'],
                }
            }).catch(this.$handleError);
            this.allRoles = res.map((c: RoleName) => {
                return {
                    name: c.name,
                    val: c.enumName.toString(),
                };
            });
            this.allRoles.unshift({name: "All roles", val: 'all'});
        },
        fillparticipantLabels(){
            const role = this.allRoles.find((r:SelectObject) => {
                return r.val === this.eventData.participantFilter.role;
            });
            const org = this.allChurches.find((r:SelectObject) => {
                return r.val === this.eventData.participantFilter.org;
            });
            if(!role || !org)
                return;
            this.eventData.participantLabels.role = role.name;
            this.eventData.participantLabels.org = org.name;
            this.eventData.participantLabels.minAge = this.eventData.participantFilter.minAge;
            this.eventData.participantLabels.maxAge = this.eventData.participantFilter.maxAge;
        },
        sendPollingEvent(){
            this.fillparticipantLabels();
            const data = this.eventData;
            data.creatorId = this.$user.personID;
            if(data.startDateTime.getTime() === 0)
                data.startDateTime = new Date();
            if(this.pollingEvent)
                this.$client.service('polling-event').update(data._key, data)
                    .then(() => {
                        this.$emit('finish');
                    }).catch(this.$handleError);
            else
                this.$client.service('polling-event').create(data)
                    .then((res: PollingEvent) => {
                        this.$emit('finish', res._key);
                    }).catch(this.$handleError);
        },
    },
    emits: ['close', 'finish']
});
</script>
