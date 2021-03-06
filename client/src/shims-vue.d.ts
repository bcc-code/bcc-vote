import feathers from '@feathersjs/feathers';
import { Router } from 'vue-router'
import { User } from './domain';


/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $router: Router,
    $user: User,
    $client: feathers.Application,
    $handleError: Function,
    $showSuccess: Function,
    $logout: Function,
    $canAdministratePollingEvents: boolean,
    $gtag: any
  }
}
