import { Feathers } from '@feathersjs/feathers'

/* eslint-disable */
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $client: Feathers;
        $user: any;
    }
}