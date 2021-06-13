import { createStore } from 'vuex'
import createMultiTabState from 'vuex-multi-tab-state';
import result from '../store/result'

export interface RootState {
  count: number
}

export default createStore<RootState>({
    state: {
        count: 0,
    },
    mutations: {
        increment(state){
            state.count++
        }
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
