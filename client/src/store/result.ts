import { Module } from 'vuex'
import { Poll, PollingEvent, PollActiveStatus, Answer, SortedOptions, Option } from '../domain'
import { store, RootState } from '../store/index'

export interface ResultState {
  count: number,
  pollingEvent?: PollingEvent | null,
  activePoll?: Poll | null,
  polls?: Array<Poll>,
  answers?: Array<Answer>
}

const result: Module<ResultState,RootState> = ({
    namespaced: true,
    state: ():ResultState => ({
        count: 10,
        pollingEvent: null,
        polls: []
    }),
    mutations: {
        'UPDATE_POLLING_EVENT': (state:ResultState, value:PollingEvent) => (state.pollingEvent = value),
        'UPDATE_ACTIVEPOLL': (state:ResultState, value:Poll) => (state.activePoll = value),
        'UPDATE_POLLS': (state:ResultState, value:Array<Poll>) => (state.polls = value),
        'UPDATE_ANSWERS': (state:ResultState, value:Array<Answer>) => (state.answers = value)
    },
    actions: {
        async loadAnswers({ commit, state: ResultState, getters }) {
            const poll = getters.activePoll;
            const query = {
                _from: poll._id
            }
            console.log(query)
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
            let sortedOptions = {} as SortedOptions
            const activePoll = getters.activePoll
            activePoll.answers.forEach((option: Option) => {
                sortedOptions[option.answerId] = {
                    count: 0,
                    bgColor: '000000',
                    ...option
                }
                colorIndex++
            })
            // if(activePoll.answers.length > 2) {
            //     const lastAnswer = poll.answers[poll.answers.length - 1]
            //     this.sortedAnswers[lastAnswer.answerId].bgColor = this.neutralColor
            // }
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