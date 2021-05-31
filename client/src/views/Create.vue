<template>
  <div class="w-full h-full bg-gray-100 px-4 py-8">
    <FormSection>
      <h3 class="font-bold mb-6">{{$t(`forms.new-poll`)}}</h3>
      <Info class="mb-8">
          {{$t('info.define-group')}}
      </Info>
      <FormField v-model="eventData.title" translation="poll-title" type="input"/>

      <FormField v-model="eventData.description" translation="poll-description" type="input" :optional="true"/>

      <FormField v-model="eventData.startDateTime" translation="poll-date" type="date"/>

      <h3 class="font-bold mt-10 mb-5">{{$t('fields.group')}}</h3>

      <Info class="mb-8">
          {{$t('info.define-group')}}
      </Info>

      <FormField v-model="filter.church" translation="poll-church" type="select" :options="churches"/>

      <div class="flex w-full gap-10 max-w-sm">
        <FormField class="flex-grow" v-model="filter.minAge" translation="poll-min-age" type="number"/>
        <FormField class="flex-grow" v-model="filter.maxAge" translation="poll-max-age" type="number"/>
      </div>

      <FormField v-model="filter.role" type='select' translation="poll-roles" :options="roles"/>

      <div class="flex justify-between py-4 font-bold items-center">
        <div>
          <h6>{{$t('info.number-of-participants')}}</h6>
          <h3>{{numberOfVoters}} {{$t('misc.voters')}}</h3>
        </div>
        <div>
          <LightButton class="text-lg">{{$t('actions.show-all-participants')}}</LightButton>
        </div>
      </div>

      <div class="flex justify-center items-center py-5 gap-5 sm:mt-4">
        <h4 @click="goHome" class="text-gray-800 font-bold p-4 cursor-pointer">Discard</h4>
        <GradButton class="text-lg" @click="createPollingEvent">
            {{$t('actions.create-meeting')}}
        </GradButton>
      </div>
    </FormSection>
  </div>
</template>

<script>

import Info from '../components/Info'
import GradButton from '../components/GradButton'
import LightButton from '../components/LightButton'
import FormField from '../components/form-field'
import FormSection from '../components/FormSection'

export default {
   components: {
        GradButton,
        LightButton,
        Info,
        FormField,
        FormSection
    },
    data() {
      return {
        churches: [],
        roles: [],
        eventData: {
          title: '',
          description: '',
          startDateTime: null,
          creatorId: this.$user.personID,
          status: 'inactive',
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
          this.churches = res.map(c => {
            return {
              name: c.name,
              val: c.churchID,
            }
          });
          this.churches.unshift({name: 'All churches', val: 0})
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
          this.roles = res.map(c => {
            return {
              name: c.name,
              val: c._key,
            }
          });
          this.roles.unshift({name: 'All roles', val: 0})
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