<template>
    <nav class="flex justify-between items-center fixed left-0 top-0 w-full z-10 text-center bg-white shadow-md " style="height: 48px">
        <div class="pl-8 flex justify-start" style="width: 10rem">
            <i class="cursor-pointer fas fa-long-arrow-alt-left" style="color:#838ca8;" @click="navigateBack">aabb</i>
        </div>
        <div class="pr-8 flex justify-end" style="width: 10rem">
            <button type="button" id="logout" @click="logout" class="hidden sm:flex items-center justify-center btn-teal rounded-xl py-1 px-4">
                <i class="cursor-pointer fas fa-sign-out-alt pr-3" style="color:#ffffff;" @click="navigateBack">abd</i>
                Hello
            </button>  
        </div>     
    </nav>
</template>

<style scoped>

</style>