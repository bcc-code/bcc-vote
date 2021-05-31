<template>
  <div class="p-10">
    <div class="w-full h-full px-4 py-8">
      awda
    </div>
  </div>
</template>
<script>
import FormField from '../components/form-field'
export default {
   components: {
        FormField
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