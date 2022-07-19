import feathers from '@feathersjs/feathers';
import { Router } from 'vue-router';
import { User } from './domain';
import firebase from 'firebase/app';
import 'firebase/firestore';

/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
/* eslint-enable */

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $router: Router,
    $user: User,
    $firestore: firebase.firestore.Firestore,
    $client: feathers.Application,
    $handleError: (error:unknown) => void,
    $showSuccess: (message: string) => void,
    $logout: () => void,
    $canAdministratePollingEvents: boolean,
    $gtag: any
  }
}
