import { PollingEvent, PollingEventStatus } from '@/domain/PollingEvent';
import { createStore } from 'vuex';
import createMultiTabState from 'vuex-multi-tab-state';
import result from '../store/result';

export interface RootState {
    pollingEvents: Array<PollingEvent>
}

export const store: any = createStore<RootState>({
    state: {
        pollingEvents: []
    },
    mutations: {
        'UPDATE_POLLING_EVENTS': (state:RootState, value:Array<PollingEvent>) => (state.pollingEvents = value)
    },
    actions: {
        async findPollingEvents({commit},archived) {
            const query = {
                
                status: archived ? {} : {
                    $ne: PollingEventStatus.Archived
                }
            };
            const unarchivedEvents = await store.$client.service('polling-event').find({ query});
            commit('UPDATE_POLLING_EVENTS',unarchivedEvents);
        }
    },
    modules: {
        result
    },
    plugins: [
        createMultiTabState({
            statesPaths: ['result']
        })
    ]
});
