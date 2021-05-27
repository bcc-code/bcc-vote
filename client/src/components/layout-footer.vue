<template>
    <footer class="flex w-full rounded-t-xl bg-green-900 p-5">
        Some text
        <div style="height: 300px"></div>

        <!-- <hr class="mb-4 border-b-1 border-gray-200" />
        <div class="flex flex-wrap items-center md:justify-between justify-center">
            <div class="w-full px-4">
                <p class="text-tint-300 font-thin py-1">
                    Copyright © {{ date }}
                    <a href="https://bcc.no" class="hover:text-tint-400">
                        Brunstad Christian Church
                    </a>
                </p>
            </div>
        </div> -->
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