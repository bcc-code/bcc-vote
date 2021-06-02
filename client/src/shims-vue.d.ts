import { ComponentCustomProperties } from 'vue';

/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

import { createApp } from 'vue'
import { Router, createRouter } from 'vue-router'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $router: Router,
    $user: any,
    $client: any,
    $showError: Function
  }
}
