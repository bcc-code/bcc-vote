<template>
    <div class="max-w-5xl mx-auto" >
        <div class="w-full h-full px-4 py-6">
            <div class="form-section text-center padding-md">
            <p class="font-bold text-blue-500 mb-3">
                {{$t('labels.bcc-vote')}}
            </p>
            <h2 class="font-bold mb-3">{{$t('labels.thank-you')}}</h2>
            <p class="text-gray-700 mb-10 pb-1">
                {{$t('info.results-will-be-visible')}}
            </p>
            <router-link to="/">
                <button class="bg-gray-200 w-full max-w-xs p-4 rounded-full mb-5">
                    <h5 class="text-blue-900 font-bold">{{$t('actions.go-back-home')}}</h5>
                </button>
            </router-link>
            </div>
        </div>
  </div>
</template>