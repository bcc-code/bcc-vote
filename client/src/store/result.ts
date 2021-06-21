import { Module } from 'vuex'
import { Poll, PollingEvent, PollActiveStatus, Answer, SortedOptions, Option, PollResult } from '../domain'
import { store, RootState } from '../store/index'

export interface ResultState {
  pollingEvent?: PollingEvent,
  activePoll?: Poll,
  pollResult?: PollResult,
  answers: Array<Answer>,
  answerIdsFromFind: Array<string>
}

const result: Module<ResultState,RootState> = ({
    namespaced: true,
    state: ():ResultState => ({
        answers: [],
        answerIdsFromFind: []
    }),
    mutations: {
        'UPDATE_POLLING_EVENT': (state:ResultState, value:PollingEvent) => (state.pollingEvent = value),
        'UPDTAE_ACTIVE_POLL': (state: ResultState, value:Poll) => {state.activePoll = value},
        'UPDATE_POLL_RESULT': (state:ResultState, value:PollResult) => (state.pollResult = value),
        'UPDATE_ANSWERS': (state:ResultState, value:Array<Answer>) => (state.answers = value),
        'ADD_ANSWER': (state:ResultState, value:Answer) => (state.answers?.unshift(value)),
        'UPDATE_ANSWERS_FROM_FIND': (state:ResultState, value:string[]) => (state.answerIdsFromFind = value),
    },
    actions: {
        async getPollingEvent({ commit },pollingEventKey:string) {
            const results = await store.$client.service('polling-event').get(pollingEventKey)
            commit('UPDATE_POLLING_EVENT',results)
        },
        async getActivePoll({ commit, state }) {
            if(!state.pollingEvent)
                throw Error('Polling event is not loaded')
            const query = {
                pollingEventId: state.pollingEvent?._key,
                activeStatus: PollActiveStatus['Live']
            }
            const activePoll = await store.$client.service('poll').find({query})
            if(activePoll.length > 0)
                commit('UPDTAE_ACTIVE_POLL', activePoll[0])
        },
        async findAnswers({ commit, getters }) {
            const activePoll = getters.activePoll
            const query = {
                _from: activePoll._id
            }
            const results = await store.$client.service('answer').find({query})
            const onlyIds = results.map((ans: Answer) => ans._key);
            commit('UPDATE_ANSWERS',results)
            commit('UPDATE_ANSWERS_FROM_FIND',onlyIds)
        },
        async getPollResult({ commit, getters }) {
            // const activePoll = getters.activePoll
            // const results = await store.$client.service('poll-result').get(activePoll._key)
            // commit('UPDATE_POLL_RESULT',results)
        },
        patchedPoll({commit,state}, patchedPoll:Poll) {
            let updatedPollsArray = [] as Array<Poll>
            updatedPollsArray.push(patchedPoll)
            if(state.polls) {
                state.polls.forEach(poll => {
                    if(poll._id !== patchedPoll._id) {
                        updatedPollsArray.push(poll)
                    }
                });
            }
            commit('UPDATE_POLLS',updatedPollsArray)
        },
        addedAnswer({commit,state}, addedAnswer:Answer) {
            if(state.answerIdsFromFind.indexOf(addedAnswer._key) >= 0)
                return;
            commit('ADD_ANSWER',addedAnswer)
        }
    },
    getters: {
        activePoll: (state:ResultState) => {
            if(state.polls && state.polls.length) {
                const activePolls = state.polls.filter(poll => poll.activeStatus === PollActiveStatus['Live'])
                if(activePolls) {
                    return activePolls[0]
                }
            }
            return null
        },
        sortedOptions: (state:ResultState, getters: any):SortedOptions => {
            let colorIndex = 0
            const colors = ['#004C78','#006887','#0081A2','#329BBD','#55B6D9','#72D0E3']
            let sortedOptions = {} as SortedOptions
            const activePoll = getters.activePoll
            activePoll.answers.forEach((option: Option) => {
                const answerCount = state.pollResult ? state.pollResult.answerCount[option.answerId] : 0
                
                sortedOptions[option.answerId] = {
                    count: answerCount,
                    bgColor: colors[colorIndex],
                    ...option
                }
                colorIndex++
            })
            if(activePoll.answers.length > 2) {
                const lastAnswer = activePoll.answers[activePoll.answers.length - 1]
                sortedOptions[lastAnswer.answerId].bgColor = '#C1C7DA'
            }
            return sortedOptions
        },
        answerCount: (state:ResultState):number => {
            if(!state.pollResult.answerCount)
                return 0;
            let count = 0;
            Object.keys(state.pollResult.answerCount).forEach((key:string) => {
                count += state.pollResult.answerCount[key];
            })
            return count;
        }
    }
})
  
export default result;