<template>
  <div class="w-full h-full bg-gray-100 px-4 py-8">
    <div class="form-section">
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

      <FormField v-model="filter.church" translation="poll-church" type="select" :options="allChurches"/>

      <div class="flex w-full gap-10 max-w-sm">
        <FormField class="flex-grow" v-model="filter.minAge" translation="poll-min-age" type="number"/>
        <FormField class="flex-grow" v-model="filter.maxAge" translation="poll-max-age" type="number"/>
      </div>

      <FormField v-model="filter.role" type='select' translation="poll-roles" :options="allRoles"/>

      <div class="flex justify-between py-4 font-bold items-center">
        <div>
          <h6>{{$t('info.number-of-participants')}}</h6>
          <h3>{{numberOfVoters}} {{$t('misc.voters')}}</h3>
        </div>
        <div>
          <div class="light-button text-lg">{{$t('actions.show-all-participants')}}</div>
        </div>
      </div>

      <div class="flex justify-center items-center py-5 gap-5 sm:mt-4">
        <h4 @click="goHome" class="text-gray-800 font-bold p-4 cursor-pointer">Discard</h4>
        <div class="gradient-button text-lg" @click="createPollingEvent">
            {{$t('actions.create-meeting')}}
        </div >
      </div>
    </div>
  </div>
</template>

<script>

import InfoBox from '../components/info-box'
import FormField from '../components/form-field'
import PollForm from '../components/PollForm'

export default {
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
          startDateTime: null,
          creatorId: this.$user.personID,
          status: 0,
        },
        filter: {
          church: 0,
          role: 0,
          minAge: null,
          maxAge: null,
        },
        numberOfVoters: 10,
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
          this.allChurches = res.map(c => {
            return {
              name: c.name,
              val: c.churchID,
            }
          });
          this.allChurches.unshift({name: 'All churches', val: 0})
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
          this.allRoles = res.map(c => {
            return {
              name: c.name,
              val: c._key,
            }
          });
          this.allRoles.unshift({name: 'All roles', val: 0})
      },
      createPollingEvent(){
        const data = this.eventData;
        data.participantFilter = {}
        for(const key in this.filter)
          if(this.filter[key])
            data.participantFilter[key] = this.filter[key];
          
        this.$client.service('meetings').create(data)
        .then((res) => {
          this.$router.push('/create/'+res._key);
        })
      },
      goHome(){
        this.$router.push('/');
      },
    }
}
</script>

<style>
</style>