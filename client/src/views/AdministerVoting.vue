<template>
  <div id="container" class="vertical">
  <h2>Administering {{$route.params.id}} meeting</h2>
  <h2>{{info.title}}</h2>
  <h3>{{info.description}}</h3>
  <div class="horizontal center-line">
    <h3 v-if="this.info.timeLeft > 0">Starts in &nbsp;</h3>
    <h3><timer :time="this.info.timeLeft" ready="OPEN"/></h3>
    <input v-if="this.info.timeLeft > 0" @click="startNow" type="submit" value="Start now"/>
  </div>
  <h2>Active Questions</h2>
  <question-display v-for="(question, ind) in activeQuestions" :key="ind" :active="true" :data="question" @close="closeQuestion(ind)"/>
  <h2>Post a new question</h2>
  <question-form :sentQuestion="newQuestion" @postQuestion="postQuestion"/>
  <h2>Closed questions</h2>
  <question-display v-for="(question, ind) in closedQuestions" :key="ind" :data="question" />
  </div>
</template>
<script>
import QuestionDisplay from '../components/QuestionDisplay.vue'
import QuestionForm from '../components/QuestionForm.vue'
import Timer from '../components/Timer'
export default {
  components: {
    Timer,
    QuestionForm,
    QuestionDisplay,
  },
  data () {
    return {
      info: {},
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
    const now = new Date().getTime();
    this.$client.service('meetings').get(this.$route.params.id)
    .then(res => {
      this.info = res;
      this.info.timeLeft = this.info.startTime - now; 
      this.info.timeLeft = Math.floor(this.info.timeLeft / 1000);
      if(this.info.endTime){
        this.info.timeLeftEnd = this.info.endTime - new Date().getTime();
        this.info.timeLeftEnd = Math.floor(this.info.timeLeftEnd / 1000);
      }
    }).catch(() => {
      this.$router.replace('/');
    })

    // get all questions
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
    this.$client.service('answers').on('created', this.newAnswer)
    this.$client.service('answers').on('patched', this.updateAnswer)
  },
  methods: {
    processQuestion(data){
      data.result = this.fillWithEmptyArrays(data.answers.length)
      if(data.isTime){
        this.processTimed(data);
        return;
      }
      this.processUntimed(data);
    },
    processTimed(data){
      const timeLeft = data.timeLimit - new Date().getTime();
      if(timeLeft < 0){
        this.closedQuestions.push(data);
        this.closedQuestionIDs.push(data._key);
        return;
      }
      data.timeLeft = Math.floor(timeLeft / 1000);
      this.startTimer(data);
      this.activeQuestions.push(data);
      this.activeQuestionIDs.push(data._key);
    },
    startTimer(data){
      data.timer = setInterval(() => {
        const ind = this.activeQuestionIDs.indexOf(data._key);
        this.activeQuestions[ind].timeLeft --;
        if(data.timeLeft < 0){
          this.closeQuestion(ind);
          clearInterval(data.timer);
        }
      }, 1000)
    },
    processUntimed(data) {
      if(data.active){
        this.activeQuestions.push(data);
        this.activeQuestionIDs.push(data._key);
        return;
      }
      this.closedQuestions.push(data);
      this.closedQuestionIDs.push(data._key);
    },
    startNow () {
      this.$client.service('meetings').patch(this.$route.params.id, {
        startTime: new Date().getTime()
      }).then(() => {
        this.info.timeLeft = 0;
      })    
    },
    endNow () {
      this.$client.service('meetings').patch(this.$route.params.id, {
        endTime: new Date().getTime()
      }).then(() => {
        this.info.timeLeftEnd = 0;
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
      this.closedQuestions.push(this.activeQuestions[ind]);
      this.activeQuestions.splice(ind, 1)
      this.activeQuestionIDs.splice(ind, 1);
    },
    closeQuestionById (id) {
      const ind = this.activeQuestionIDs.indexOf(id);
      if(ind > -1)
        this.closeQuestion(ind)
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