import { Module } from 'vuex'
import { Poll, PollingEvent, PollActiveStatus, Answer, SortedOptions, Option } from '../domain'
import { store, RootState } from '../store/index'

export interface ResultState {
  pollingEvent?: PollingEvent | null,
  polls?: Array<Poll>,
  answers?: Array<Answer>
}

const result: Module<ResultState,RootState> = ({
    namespaced: true,
    state: ():ResultState => ({
        pollingEvent: null,
        polls: [],
        answers: []
    }),
    mutations: {
        'UPDATE_POLLING_EVENT': (state:ResultState, value:PollingEvent) => (state.pollingEvent = value),
        'UPDATE_POLLS': (state:ResultState, value:Array<Poll>) => (state.polls = value),
        'UPDATE_ANSWERS': (state:ResultState, value:Array<Answer>) => (state.answers = value),
        'ADD_ANSWER': (state:ResultState, value:Answer) => (state.answers?.unshift(value))
    },
    actions: {
        async getPollingEvent({ commit, state: ResultState, getters },pollingEventKey:string) {
            const results = await store.$client.service('polling-event').get(pollingEventKey)
            commit('UPDATE_POLLING_EVENT',results)
        },
        async loadAnswers({ commit, state: ResultState, getters }) {
            const poll = getters.activePoll;
            const query = {
                _from: poll._id
            }
            const results = await store.$client.service('answer').find({query})
            commit('UPDATE_ANSWERS',results)
            //answers.forEach((a:Answer) => {this.addAnswer(a)})
        },
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
                const answers = state.answers?.filter((ans:Answer) => ans.answerId == option.answerId)
                sortedOptions[option.answerId] = {
                    count: answers ? answers.length : 0,
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
            if(state.answers) {
                return state.answers.length
            }
            return 0
        }
    }
})
  
export default result;