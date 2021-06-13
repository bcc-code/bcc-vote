import { createStore } from 'vuex'
import createMultiTabState from 'vuex-multi-tab-state';
import result from '../store/result'

export interface RootState {
}

export const store: any = createStore<RootState>({
    state: {
    },
    mutations: {
    },
    actions: {
    },
    modules: {
        result
    },
    plugins: [
        createMultiTabState({
            statesPaths: ['result']
        })
    ]
})