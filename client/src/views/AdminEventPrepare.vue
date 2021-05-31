<template>
  <div class="w-full h-full bg-gray-100 px-4 py-8">
    <FormSection>
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
      }
    }
}
</script>