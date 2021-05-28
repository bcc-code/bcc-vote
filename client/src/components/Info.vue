<template>
  <div class="m-4 py-4 px-2 border border-opacity-10 rounded-lg bg-blue-300 flex">
    <div class="p-1 px-2">
    <div class="h-4 w-4 info-icon"></div>
    </div>
    <label class="flex-grow text-blue-800">
      <slot>
      </slot>
    </label>
    <div class="p-1 px-2">
      <div class="h-4 w-4 cross-icon"></div>
    </div>
  </div>
</template>