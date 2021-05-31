<template>
  <div class="p-10">
    <div class="w-full h-full px-4 py-8">
      <FormSection>
        awda
      </FormSection>
    </div>
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
        pollingEvent: {
          title: "Yearly Meeting",
          description: "Yearly Meeting in Oslo",
          type: "poll",
          creatorId: "person/122324242",
          participantFilter: {
            orgs: [],
            roles: [],
            minAge: 10,
            maxAge: 100
          }
        }
      }
    }
}
</script>