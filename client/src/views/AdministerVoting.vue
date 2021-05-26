<template>
  <div id="container" class="vertical">
  <meeting-info v-if="infoReady" :info="info"/>
  <input v-if="this.info.timeLeft > 0" @click="startNow" type="submit" value="Start now"/>
  <input v-if="this.info.timeLeftEnd > 0" @click="endNow" type="submit" value="End now"/>
  <h2>Active Questions</h2>
  <question-display v-for="(question, ind) in activeQuestions" :key="ind" :active="true" :data="question" @close="closeQuestion(ind)" @timeOut="closeQuestion(ind)"/>
  <h2>Post a new question</h2>
  <question-form :sentQuestion="newQuestion" @postQuestion="postQuestion" />
  <h2>Closed questions</h2>
  <question-display v-for="(question, ind) in closedQuestions" :key="ind" :data="question" />
  </div>
</template>
<script>

import MeetingInfo from '../components/MeetingInfo.vue'
import QuestionDisplay from '../components/QuestionDisplay.vue'
import QuestionForm from '../components/QuestionForm.vue'

export default {
  components: {
    QuestionForm,
    QuestionDisplay,
    MeetingInfo
  },
  data () {
    return {
      info: {},
      infoReady: false,
      newQuestion: {
        text: '',
        answers: ['Yes', 'No'],
        public: false,
        timeLimit: 300,
        isTime: false,
      },
      activeQuestions: [],
      activeQuestionIDs: [],
      closedQuestions: [],
      closedQuestionIDs: [],
    }
  },
  created(){
    this.loadMeeting();
    this.loadQuestions();
    
    this.$client.service('answers').on('created', this.newAnswer)
    this.$client.service('answers').on('patched', this.updateAnswer)
  },
  methods: {
    loadMeeting(){
      this.$client.service('meetings').get(this.$route.params.id)
      .then(res => {
        this.info = res;
        this.info.timeLeft = this.info.startTime - new Date().getTime(); 
        this.info.timeLeft = Math.floor(this.info.timeLeft / 1000);
        if(this.info.endTime){
          this.info.timeLeftEnd = this.info.endTime - new Date().getTime();
          this.info.timeLeftEnd = Math.floor(this.info.timeLeftEnd / 1000);
        }
        this.infoReady = true;
      }).catch(() => {
        this.$router.replace('/');
      })
    },
    loadQuestions(){
      this.$client.service('questions').find({
        query: {
          meetingID: this.$route.params.id,
        }
      })
      .then(res => {
        res.data.forEach(r => {
          this.processQuestion(r);
        })
        this.activeQuestionIDs.forEach(id => {
          this.loadResultActive(id);
        })
        this.closedQuestionIDs.forEach(id => {
          this.loadResultClosed(id);
        })
      })
    },
    processQuestion(data){
      data.result = this.fillWithEmptyArrays(data.answers.length)
      if(!data.active){
        this.addClosed(data);
        return;
      }
      if(data.isTime){
        const timeLeft = data.timeLimit - new Date().getTime();
        if(timeLeft < 0){
          this.addClosed(data);
          return
        }
      }
      this.addActive(data);
      
    },
    addActive(data){
      this.activeQuestions.push(data);
      this.activeQuestionIDs.push(data._key);
    },
    addClosed(data){
      this.closedQuestions.push(data);
      this.closedQuestionIDs.push(data._key);
    },
    removeActive(ind){
      this.activeQuestions.splice(ind, 1)
      this.activeQuestionIDs.splice(ind, 1);
    },
    removeClosed(ind){
      this.closedQuestions.splice(ind, 1)
      this.closedQuestionIDs.splice(ind, 1);
    },
    startNow () {
      this.infoReady = false;
      this.$client.service('meetings').patch(this.$route.params.id, {
        startTime: new Date().getTime()
      }).then(() => {
        this.info.startTime = new Date().getTime();
        this.infoReady = true;
      })    
    },
    endNow () {
      this.infoReady = false;
      this.$client.service('meetings').patch(this.$route.params.id, {
        endTime: new Date().getTime()
      }).then(() => {
        this.info.endTime = new Date().getTime();
        this.infoReady = true;
      })  
    },
    postQuestion () {
      this.newQuestion.active = true;
      this.newQuestion.meetingID = this.$route.params.id;
      if(this.newQuestion.isTime)
        this.newQuestion.timeLimit = new Date().getTime() + this.newQuestion.timeLimit * 1000;
      this.$client.service('questions').create(this.newQuestion)
      .then(res => {
        this.processQuestion(res);
      })
    },
    closeQuestion (ind) {
      if(!this.activeQuestions[ind].isTime)
        this.$client.service('questions').patch(this.activeQuestions[ind]._key, {
          active: false,
        })
      else {
        const now = new Date().getTime();
        this.activeQuestions[ind].timeLimit = now;
        this.$client.service('questions').patch(this.activeQuestions[ind]._key, {
          timeLimit: now,
        })
      }
      this.addClosed(this.activeQuestions[ind]);
      this.removeActive(ind);
    },
    newAnswer (data) {
      const ind = this.activeQuestionIDs.indexOf(data.questionID);
      if(ind == -1)
        return;
      this.activeQuestions[ind].result[data.answer-1].push(data.personID);
    },
    updateAnswer (data) {
      const ind = this.activeQuestionIDs.indexOf(data.questionID);
      if(ind == -1)
        return;
      
      for(let i = 0; i < this.activeQuestions[ind].result.length; i++){
        const r = this.activeQuestions[ind].result[i].indexOf(data.personID);
        if(r > -1){
          this.activeQuestions[ind].result[i].splice(r, 1);
          break;
        }
      }
      this.activeQuestions[ind].result[data.answer-1].push(data.personID);
    },
    loadResultActive(questionID) {
      this.$client.service('answers').find({
        query: {
          questionID
        }
      }).then(res => {
        const ind = this.activeQuestionIDs.indexOf(questionID);
        res.data.forEach(ans => {
          this.activeQuestions[ind].result[ans.answer - 1].push(ans.personID);
        })
      })
    },
    loadResultClosed(questionID) {
      this.$client.service('answers').find({
        query: {
          questionID
        }
      }).then(res => {
        const ind = this.closedQuestionIDs.indexOf(questionID);
        res.data.forEach(ans => {
          this.closedQuestions[ind].result[ans.answer - 1].push(ans.personID);
        })
      })
    },
    fillWithEmptyArrays(num){
      const arr = new Array(num);
      for(let i = 0; i < num; i++){
        arr[i] = [];
      }
      return arr;
    }
  }
}
</script>