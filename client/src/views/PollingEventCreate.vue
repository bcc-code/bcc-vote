<template>
  <div class="max-w-screen-lg mx-auto px-4 py-8">
        <div class="form-section padding-lg">
            <PollingEventForm @close="goHome" @finish="goToEvent"/>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import PollingEventForm from '../components/polling-event-form.vue';
export default defineComponent({
    components: {
        PollingEventForm 
    },
    methods: {
        goHome(): void{
            this.$router.push('/');
        },
        goToEvent(id: number): void{
            this.$router.push('/polling-event/admin/'+id);
        }
    }
});
</script>

            
