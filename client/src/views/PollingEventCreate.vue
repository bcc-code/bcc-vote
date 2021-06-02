<template>
  <div class="max-w-screen-lg mx-auto px-4 py-8">
    <div class="form-section padding-lg">
      <h3 class="font-bold mb-6">{{$t(`forms.new-poll`)}}</h3>
      <InfoBox class="mb-8">
          {{$t('info.define-group')}}
      </InfoBox>
      <FormField v-model="eventData.title" translation="poll-title" type="string"/>

      <FormField v-model="eventData.description" translation="poll-description" type="string" :optional="true"/>

      <FormField v-model="eventData.startDateTime" translation="poll-date" type="date"/>

      <h3 class="font-bold mt-10 mb-5">{{$t('fields.group')}}</h3>

      <InfoBox class="mb-8">
          {{$t('info.define-group')}}
      </InfoBox>

      <FormField v-model="eventData.participantFilter.orgs" translation="poll-church" type="select" :options="allChurches"/>

      <div class="flex w-full gap-10 max-w-sm">
        <FormField class="flex-grow" v-model="eventData.participantFilter.minAge" translation="poll-min-age" type="number"/>
        <FormField class="flex-grow" v-model="eventData.participantFilter.maxAge" translation="poll-max-age" type="number"/>
      </div>

      <FormField v-model="eventData.participantFilter.roles" type='select' translation="poll-roles" :options="allRoles"/>

      <div v-if="numberOfVoters" class="flex justify-between py-4 font-bold items-center">
        <div>
          <h6>{{$t('info.number-of-participants')}}</h6>
          <h3>{{numberOfVoters}} {{$t('labels.voters')}}</h3>
        </div>
        <div>
          <div class="light-button text-lg">{{$t('actions.show-all-participants')}}</div>
        </div>
      </div>

      <div class="flex justify-center py-5 gap-5 sm:mt-4">
        <h5 @click="goHome" class="md-button text-gray-800 font-bold">{{$t('actions.discard')}}</h5>
        <h5 class="gradient-button md-button" @click="createPollingEvent">
            {{$t('actions.create-meeting')}}
        </h5>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import InfoBox from '../components/info-box.vue'
import FormField from '../components/form-field.vue'
import PollForm from '../components/poll-form.vue'
import { PollingEventPrepare, PollingEvent, PollingEventType, PollingEventStatus } from '../domain'

import { defineComponent } from 'vue'
export default defineComponent({
   components: {
        InfoBox,
        FormField,
        PollForm,
    },
    data() {
      return {
        allChurches: [],
        allRoles: [],
        eventData: {
          title: '',
          description: '',
          type: PollingEventType['Live Event'],
          status: PollingEventStatus['Not Started'],
          startDateTime: new Date(0),
          creatorId: '',
          participantFilter: {
            orgs: 'all',
            roles: 'all',
            minAge: undefined,
            maxAge: undefined,
          }
        } as PollingEventPrepare,
        
        numberOfVoters: null,
      }
    },
    async created(){
      this.loadOrgs();
      this.loadRoles();
    },
    methods: {
      async loadOrgs(){
          const res = await this.$client.service('org').find({
            query: {
              activeStatusCode: 0,
              type: 'church',
              $select: ['name', 'churchID'],
              $sort: {
                name: 1
              }
            }
          })
          res.unshift({name: "All churches", churchID: 'all'})
          this.allChurches = res.map((c: any) => {
            return {
              name: c.name,
              val: c.churchID.toString(),
            }
          });
      },
      async loadRoles(){
          const res = await this.$client.service('role').find({
            query: {
              $sort: {
                name: 1
              },
              
              $select: ['name', '_key'],
            }
          })
          this.allRoles = res.map((c:any) => {
            return {
              name: c.name,
              val: c._key.toString(),
            }
          });
          res.unshift({name: "All roles", _key: 'all'})
          this.allRoles = res.map((c: any) => {
            return {
              name: c.name,
              val: c._key.toString(),
            }
          });
      },
      createPollingEvent(){
        const data:any = this.eventData;
        data.creatorId = this.$user.personID.toString();
        
          
        this.$client.service('polling-event').create(data)
        .then((res: PollingEvent) => {
          this.$router.push(`/polling-event/prepare/${res._key}`);
        })
      },
      goHome(){
        this.$router.push('/');
      },
    }
})
</script>

<style>
</style>