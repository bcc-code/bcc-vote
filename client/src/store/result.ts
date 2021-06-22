import { Module } from 'vuex'
import { Poll, PollingEvent, PollActiveStatus, Answer, SortedOptions, Option, PollResult } from '../domain'
import { store, RootState } from '../store/index'

export interface ResultState {
  pollingEvent?: PollingEvent,
  activePoll?: Poll,
  pollResult?: PollResult,
  answers: Array<Answer>,
  answerIdsFromFind?: Set<string>
}


const result: Module<ResultState,RootState> = ({
    namespaced: true,
    state: ():ResultState => ({
        answers: [],
    }),
    mutations: {
        'UPDATE_POLLING_EVENT': (state:ResultState, value:PollingEvent) => (state.pollingEvent = value),
        'UPDATE_ACTIVE_POLL': (state: ResultState, value:Poll) => {state.activePoll = value},
        'UPDATE_POLL_RESULT': (state:ResultState, value:PollResult) => (state.pollResult = value),
        'UPDATE_ANSWERS': (state:ResultState, value:Array<Answer>) => (state.answers = value),
        'ADD_ANSWER': (state:ResultState, value:Answer) => (state.answers?.unshift(value)),
        'UPDATE_ANSWERS_FROM_FIND': (state:ResultState, value:Set<string>) => (state.answerIdsFromFind = value),
    },
    actions: {
        async getPollingEvent({ commit },pollingEventKey:string) {
            const results = await store.$client.service('polling-event').get(pollingEventKey)
            commit('UPDATE_POLLING_EVENT',results)
        },
        async getActivePoll({ commit, state }) {
            if(!state.pollingEvent)
                return
            const query = {
                pollingEventId: state.pollingEvent?._key,
                activeStatus: PollActiveStatus['Live']
            }
            const activePoll = await store.$client.service('poll').find({query})
            if(activePoll.length > 0)
                commit('UPDATE_ACTIVE_POLL', activePoll[0])
        },
        async findAnswers({ commit, state }) {
            if(!state.activePoll)
                return
            const query = {
                _from: state.activePoll._id
            }
            const results = await store.$client.service('answer').find({query})
            const onlyIds = new Set(results.map((ans: Answer) => ans._key))
            commit('UPDATE_ANSWERS',results)
            commit('UPDATE_ANSWERS_FROM_FIND',onlyIds)
        },
        async getPollResult({ commit, state }) {
            if(!state.activePoll)
                return
            const results = await store.$client.service('poll-result').get(state.activePoll._key)
            commit('UPDATE_POLL_RESULT',results)
        },
        patchedPoll({commit,state}, patchedPoll:Poll) {
            if(!state.pollingEvent || patchedPoll.pollingEventId !== state.pollingEvent._key)
                return;
            if(patchedPoll.activeStatus === PollActiveStatus['Live'])
                commit('UPDATE_ACTIVE_POLL',patchedPoll)
            else
                commit('UPDATE_ACTIVE_POLL', undefined)
        },
        addedAnswer({commit,state}, addedAnswer:Answer) {
            if(!state.answerIdsFromFind || state.answerIdsFromFind.has(addedAnswer._key))
                return
            commit('ADD_ANSWER',addedAnswer)
        }
    },
    getters: {
        sortedOptions: (state:ResultState):SortedOptions => {
            const activePoll = state.activePoll
            const pollResult = state.pollResult
            if(!activePoll|| !pollResult)
                return {} as SortedOptions
            let colorIndex = 0
            const colors = ['#004C78','#006887','#0081A2','#329BBD','#55B6D9','#72D0E3']
            let sortedOptions = {} as SortedOptions
            
            activePoll.answers.forEach((option: Option) => {
                const answerCount = pollResult.answerCount[option.answerId]
                sortedOptions[option.answerId] = {
                    count: answerCount,
                    bgColor: colors[colorIndex],
                    ...option
                }
                colorIndex++
                if(colorIndex >= colors.length)
                    colorIndex = 0;
            })
            if(activePoll.answers.length > 2) {
                const lastAnswer = activePoll.answers[activePoll.answers.length - 1]
                sortedOptions[lastAnswer.answerId].bgColor = '#C1C7DA'
            }
            return sortedOptions
        },
        answerCount: (state:ResultState):number => {
            const results = state.pollResult;
            if(!results)
                return 0;
            let count = 0;
            Object.keys(results.answerCount).forEach((key:string) => {
                count += results.answerCount[key];
            })
            return count;
        }
    }
})
  
export default result;