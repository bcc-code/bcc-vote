<template>
  <div class="w-full h-full bg-gray-100 px-4 py-8">
    <FormSection name="new-poll">
      <Info class="mb-8">
          {{$t('info.define-group')}}
      </Info>

      <FormField v-model="formData.title" name="poll-title" type="input"/>

      <FormField v-model="formData.minAge" name="poll-description" type="input" :optional="true"/>

      <FormField v-model="formData.date" name="poll-date" type="date"/>

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
import VSelect from 'vue-select'

export default {
   components: {
        GradButton,
        Info,
        FormField,
        FormSection,
        VSelect
    },
    data() {
      return {
        countries: [
          {name: 'P1', id: 1},
          {name: 'P2', id: 2},
          {name: 'P3', id: 3},
        ],
        formData: {
          title: 'Hello',
          minAge: "10",
          date: new Date().getTime()
        }
      }
    }
}
</script>

<style>
</style>