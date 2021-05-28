<template>
  <div id="container" class="vertical">
    <meeting-info v-if="infoReady" :info="info"/>
    <template v-if="activeQuestions.length">
      <h2>Active Questions</h2>
      <question-answer v-for="(question, ind) in activeQuestions" :key="ind" :data="question" @answer="sendAns(ind, $event)" @timeOut="closeQuestion(ind)"/>
    </template>
    <template v-if="closedQuestions.length">
      <h2>Closed Questions</h2>
      <question-display v-for="(question, ind) in closedQuestions" :key="ind" :data="question"/>
    </template>
  </div>
</template>
<script>
import MeetingInfo from '../components/P_MeetingInfo.vue'
import QuestionAnswer from '../components/P_QuestionAnswer.vue'
import QuestionDisplay from '../components/P_QuestionDisplay.vue'
export default {
    components: {
        QuestionAnswer,
    
        QuestionDisplay,
        MeetingInfo
    },
    data () {
        return {
            info: {},
            infoReady: false,
            activeQuestions: [],
            closedQuestions: [],
            activeQuestionIDs: [],
            closedQuestionIDs: [],
        }
    },
    created () {
        this.loadMeeting()
        this.loadQuestions()
    
        this.$client.service('meetings').on('patched', this.updateMeeting)
        this.$client.service('questions').on('created', this.newQuestion)
        this.$client.service('questions').on('patched', this.updateQuestion)
    },
    methods: {
        loadMeeting(){
            this.$client.service('meetings').get(this.$route.params.id)
                .then(res => {
                    this.info = res
                    this.infoReady = res
                }).catch(() => {
                    this.$router.replace('/')
                })
        },
        loadQuestions(){
            this.$client.service('questions').find({
                query: {
                    meetingID: this.$route.params.id,
                }
            }).then(res => {
                res.data.forEach(r => {
                    this.processQuestion(r)
                })
                this.loadMyAnswers()
            })
        },
        processQuestion(data){
            data.result = this.fillWithEmptyArrays(data.answers.length)
            if(!data.active){
                this.addToClosed(data)
                return
            }
            if(data.isTime){
                const timeLeft = data.timeLimit - new Date().getTime()
                if(timeLeft < 0){
                    this.addToClosed(data)
                    return
                }
            }
            this.addActive(data)
        },
        addActive(data){
            this.activeQuestions.push(data)
            this.activeQuestionIDs.push(data._key)
        },
        addClosed(data){
            this.closedQuestions.push(data)
            this.closedQuestionIDs.push(data._key)
        },
        removeActive(ind){
            this.activeQuestions.splice(ind, 1)
            this.activeQuestionIDs.splice(ind, 1)
        },
        removeClosed(ind){
            this.closedQuestions.splice(ind, 1)
            this.closedQuestionIDs.splice(ind, 1)
        },
        addToClosed(data){
            let promise
            if(data.public){
                promise = this.loadAnswersPublic(data)
            }
            else{
                promise = this.loadAnswersSecret(data)
            }
            promise.then(() => {
                this.addClosed(data)
            })
        },
        loadMyAnswers() {
            this.$client.service('answers').find({
                query: {
                    personID: this.$user.personID,
                    questionID: {
                        $in: this.activeQuestionIDs
                    }
                }
            }).then(res => {
                res.data.forEach(ans => {
                    const ind = this.activeQuestionIDs.indexOf(ans.questionID)
                    this.activeQuestions[ind].savedAnswer = ans.answer
                    this.activeQuestions[ind].answerID = ans._key
                })
            })
        },
        sendAns(ind, val) {
            if(!val){
                console.log('no value')
                return
            }
            if(this.activeQuestions[ind].answerID){
                this.updateAns(ind, val)
            }
            else{
                this.createAns(ind, val)
            }
        },
        updateAns(ind, val) {
            this.$client.service('answers').patch(this.activeQuestions[ind].answerID, {
                answer: val,
                questionID: this.activeQuestions[ind]._key
            })
                .then(() => {
                    this.activeQuestions[ind].savedAnswer = val
                }).catch(err => {
                    console.log(err)
                })
        },
        createAns(ind, val) {
            const data = {
                personID: this.$user.personID,
                questionID: this.activeQuestions[ind]._key,
                meetingID: this.$route.params.id,
                answer: val,
            }
            this.$client.service('answers').create(data)
                .then(res => {
                    this.activeQuestions[ind].answerID = res._key
                    this.activeQuestions[ind].savedAnswer = val
                })
                .catch(err => {
                    console.log(err)
                })
        },
        updateMeeting (data){
            console.log('updating meeting', data)
            if(data._key != this.$route.params.id)
                return
            this.info = data
        },
        newQuestion (data) {
            if(data.meetingID != this.$route.params.id)
                return
            this.processQuestion(data)
        },
        updateQuestion (data) {
            if(data.meetingID != this.$route.params.id)
                return
            const ind = this.activeQuestionIDs.indexOf(data._key)
            this.activeQuestions[ind] = data
            if(data.active == false){
                this.closeQuestion(ind)
            }
        },
        closeQuestion(ind) {
            this.addToClosed(this.activeQuestions[ind])
            this.removeActive(ind)
        },
        loadAnswersPublic(question){
            question.result = this.fillWithEmptyArrays(question.answers.length)
            return new Promise(resolve => {
                this.$client.service('answers').find({
                    query: {
                        questionID: question._key,
                    }
                }).then(res => {
                    res.data.forEach(ans => {
                        question.result[ans.answer - 1].push(ans.personID)
                    })
                    resolve()
                })
            })
        },
        loadAnswersSecret(question){
            question.result = new Array(question.answers.length).fill(0)
            return new Promise(resolve => {
                this.$client.service('answers').find({
                    query: {
                        questionID: question._key,
                        $select: ['answer']
                    }
                }).then(res => {
                    res.data.forEach(ans => {
                        question.result[ans.answer - 1]++
                    })
                    resolve()
                })
            })
        },
        fillWithEmptyArrays(num){
            const arr = new Array(num)
            for(let i = 0; i < num; i++){
                arr[i] = []
            }
            return arr
        }
    },
}
</script>
