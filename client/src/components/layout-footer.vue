<template>
    <footer class="w-full rounded-t-xl bg-blue-900 p-6 text-white text-xl">
        <div class="py-3">
          <label class="block font-bold">{{$t('labels.contact')}}</label>
          <a href="https://bcc.no" class="block text-xl">{{$t('actions.customer-support')}}</a>
        </div>
        <div class="py-8 text-center">
          Copyright © {{ year }}
          <a href="https://bcc.no" class="font-bold text-xl block md:inline-block">Brunstad Christian Church</a>
        </div>
    </footer>
</template>
<script>
export default {
    data: function() {
        return {
            year: new Date().getFullYear()
        };
    }
};
</script>
