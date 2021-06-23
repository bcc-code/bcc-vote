<template>
    <div class="max-w-5xl mx-auto" >
        <div class="w-full h-full px-4 py-6">
            <div class="form-section text-center p-5">
                <h4 class="font-bold text-blue-700 mb-3 mt-4">
                    {{$route.params.title}}
                </h4>
                <h2 class="font-bold pb-2 mb-12">{{$t('labels.thank-you')}}</h2>
                <router-link to="/">
                    <button class="bg-gray-200 w-full max-w-xs p-4 rounded-full">
                        <h5 class="text-blue-900 font-bold">{{$t('actions.go-back-home')}}</h5>
                    </button>
                </router-link>
            </div>
        </div>
  </div>
</template>