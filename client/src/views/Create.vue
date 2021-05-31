<template>
  <div class="w-full h-full bg-gray-100 px-4 py-8">
    <FormSection name="new-poll">
      <Info class="mb-8">
          {{$t('info.define-group')}}
      </Info>
      <FormField v-model="formData.title" name="poll-title" type="input"/>

      <FormField v-model="formData.description" name="poll-description" type="input" :optional="true"/>

      <FormField v-model="formData.date" name="poll-date" type="date"/>

      <h3 class="font-bold mt-10 mb-5">{{$t('fields.group')}}</h3>

      <Info class="mb-8">
          {{$t('info.define-group')}}
      </Info>

      <FormField v-model="formData.church" name="poll-church" type="select" :options="churches"/>

      <div class="flex w-full gap-10">
        <FormField class="flex-grow" v-model="formData.minAge" name="poll-min-age" type="number"/>
        <FormField class="flex-grow" v-model="formData.maxAge" name="poll-max-age" type="number"/>
      </div>

      <FormField v-model="formData.role" type='select' name="poll-roles" :options="roles"/>

      <GradButton class="text-2xl sm:text-base sm:mt-4">
          {{$t('actions.create-meeting')}}
      </GradButton>
    </FormSection>
  </div>
</template>

<script>

import Info from '../components/Info'
import GradButton from '../components/GradButton'
import FormField from '../components/form-field'
import FormSection from '../components/FormSection'

export default {
   components: {
        GradButton,
        Info,
        FormField,
        FormSection
    },
    data() {
      return {
        churches: [
          {name: 'All Churches', val: 0},
          {name: 'BKM Svartskog', val: 505},
          {name: 'BKM Malinka', val: 55},
        ],
        roles: [
          {name: 'PMO Manager', val: 0},
          {name: 'Developer', val: 505},
          {name: 'Member', val: 55},
        ],
        formData: {
          title: 'Hello',
          minAge: "10",
          church: -1,
          minAge: 0,
          maxAge: 0,
          role: -1,
          date: 0,
          val: 'av',
        }
      }
    }
}
</script>

<style>
</style>