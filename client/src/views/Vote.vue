<template>
  <div id="container" class="vertical">
    <h2>Voting in {{$route.params.id}} voting</h2>
    <h2>{{info.title}}</h2>
    <h3>{{info.description}}</h3>
    <div class="horizontal center-line">
      <h3 v-if="this.info.timeLeft > 0">Starts in &nbsp;</h3>
      <h3><timer :time="this.info.timeLeft" ready="Started"/></h3>
    </div>
    <template v-if="activeQuestions.length">
      <h2>Active Questions</h2>
      <question-answer v-for="(question, ind) in activeQuestions" :key="ind" :data="question" @answer="sendAns(ind, $event)"/>
    </template>
    <template v-if="closedQuestions.length">
      <h2>Closed Questions</h2>
      <question-display v-for="(question, ind) in closedQuestions" :key="ind" :data="question"/>
    </template>
  </div>
</template>
<script>
import QuestionAnswer from '../components/QuestionAnswer.vue'
import QuestionDisplay from '../components/QuestionDisplay.vue'
import Timer from '../components/Timer'
export default {
  components: {
    Timer,
    QuestionAnswer,
    
    QuestionDisplay
  },
  data () {
    return {
      info: {},
      activeQuestions: [],
      closedQuestions: [],
      activeQuestionIDs: [],
      closedQuestionIDs: [],
    }
  },
  created () {
    this.$client.service('meetings').get(this.$route.params.id)
    .then(res => {
      this.info = res;
      this.info.timeLeft = this.info.startTime - new Date().getTime();
      this.info.timeLeft = Math.floor(this.info.timeLeft / 1000);
      if(this.info.endTime){
        this.info.timeLeftEnd = this.info.endTime - new Date().getTime();
        this.info.timeLeftEnd = Math.floor(this.info.timeLeftEnd / 1000);
      }
    }).catch(() => {
      this.$router.replace('/');
    })
    this.$client.service('questions').find({
      query: {
        meetingID: this.$route.params.id,
      }
    }).then(res => {
      res.data.forEach(r => {
        this.processQuestion(r);
      })
      this.loadMyAnswers();
    })
    // setInterval(() => {
    //   this.info.timeLeft --;
    //   this.info.timeLeftEnd --;
    //   this.activeQuestion.timeLeft --;
    // }, 1000);
    this.$client.service('meetings').on('patched', this.updateMeeting);
    this.$client.service('questions').on('created', this.newQuestion);
    this.$client.service('questions').on('patched', this.updateQuestion);
  },
  methods: {
    processQuestion(data){
      if(data.isTime){
        this.processTimed(data);
        return;
      }
      this.processUntimed(data);
    },
    processUntimed(data){
      if(data.active){
        this.activeQuestions.push(data);
        this.activeQuestionIDs.push(data._key);
      }
      else{
        this.addToClosed(data);
      }
    },
    processTimed(data){
      const timeLeft = data.timeLimit - new Date().getTime();
      if(timeLeft < 0){
        this.addToClosed(data);
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
    addToClosed(data){
      let promise;
      if(data.public){
        promise = this.loadAnswersPublic(data);
      }
      else{
        promise = this.loadAnswersSecret(data);
      }
      promise.then(() => {
        this.closedQuestions.push(data);
        this.closedQuestionIDs.push(data._key);
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
          const ind = this.activeQuestionIDs.indexOf(ans.questionID);
          this.activeQuestions[ind].savedAnswer = ans.answer;
          this.activeQuestions[ind].answerID = ans._key;
        })
      })
    },
    sendAns(ind, val) {
      if(!val){
        console.log('no value');
        return;
      }
      if(this.activeQuestions[ind].answerID){
        this.updateAns(ind, val);
      }
      else{
        this.createAns(ind, val);
      }
    },
    updateAns(ind, val) {
      this.$client.service('answers').patch(this.activeQuestions[ind].answerID, {
        answer: val,
        questionID: this.activeQuestions[ind]._key
      })
      .then(() => {
        this.activeQuestions[ind].savedAnswer = val;
      }).catch(err => {
        console.log(err);
      })
    },
    createAns(ind, val) {
      const data = {
        personID: this.$user.personID,
        questionID: this.activeQuestions[ind]._key,
        meetingID: this.$route.params.id,
        answer: val,
      };
      this.$client.service('answers').create(data)
      .then(res => {
        this.activeQuestions[ind].answerID = res._key;
        this.activeQuestions[ind].savedAnswer = val;
      })
      .catch(err => {
        console.log(err);
      })
    },
    updateMeeting (data){
      if(data._key != this.$route.params.id)
        return;
      this.info = data;
    },
    newQuestion (data) {
      if(data.meetingID != this.$route.params.id)
        return;
      this.processQuestion(data);
    },
    updateQuestion (data) {
      if(data.meetingID != this.$route.params.id)
        return;
      const ind = this.activeQuestionIDs.indexOf(data._key);
      this.activeQuestions[ind] = data;
      if(data.active == false){
        this.closeQuestion(ind);
      }
    },
    loadQuestion (questionID){
      this.$client.service('questions').get(questionID)
      .then(res => {
        this.activeQuestion = res;
        this.$client.service('answers').find({
          query: {
            questionID: res._key,
            personID: this.$user.personID
          }
        }).then(res => {
          if(res.total == 1){
            this.activeQuestion.savedAnswer = res.data[0].answer;
            this.active
            this.activeQuestion.answerID = res.data[0]._key;
          }
        })
      })
    },
    closeQuestion(ind) {
      this.addToClosed(this.activeQuestions[ind]);
      this.activeQuestions.splice(ind, 1);
      this.activeQuestionIDs.splice(ind, 1);
    },
    loadAnswersPublic(question){
      question.result = this.fillWithEmptyArrays(question.answers.length);
      return new Promise(resolve => {
        this.$client.service('answers').find({
          query: {
            questionID: question._key,
          }
        }).then(res => {
          res.data.forEach(ans => {
            question.result[ans.answer - 1].push(ans.personID);
          })
          resolve();
        })
      })
    },
    loadAnswersSecret(question){
      question.result = new Array(question.answers.length).fill(0);
      return new Promise(resolve => {
        this.$client.service('answers').find({
          query: {
            questionID: question._key,
            $select: ['answer']
          }
        }).then(res => {
          res.data.forEach(ans => {
            question.result[ans.answer - 1]++;
          })
          resolve();
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
  },
}
</script>