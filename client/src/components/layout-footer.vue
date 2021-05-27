<template>
    <footer class="w-full rounded-t-xl bg-gradient-to-tr from-blue-900 to-blue-600 p-6 text-white text-xl">
        <div class="py-3">
          <label class="block font-bold">OM BCC</label>
          <a href="https://bcc.no" class="block text-xl">BCC nettside</a>
          <a href="https://bcc.no" class="block text-xl">Årsrapporter</a>
        </div>
        <div class="py-3">
          <label class="block font-bold">Kontakt</label>
          <a href="https://bcc.no" class="block text-xl">Customer support</a>
        </div>
        <div class="py-5 text-center">
          Copyright © {{ date }}
          <a href="https://bcc.no" class="font-bold text-xl">Brunstad Christian Church</a>
        </div>
    </footer>
</template>
<script>
export default {
    data: function() {
        return {
            date: new Date().getFullYear()
        }
    }
}
</script>