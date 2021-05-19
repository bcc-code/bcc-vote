<template>
  <div v-if="ready" id="container" class="width-100 vertical">
    <h1>Initialize voting</h1>
    <h2>Questionnaire</h2>
    <template-form v-if="editQuestions" submitText="done" :sentTemplate="template" @submit="editQuestions = false"></template-form>
    <div v-else class="width-90 color-grey rounded horizontal space-out center-line padding-vertical-10">
      <template-info :title="template.title" :questionNum="template.questions.length"></template-info>
      <icon-base @click="editQuestions = true" class="rounded box-50 color-yellow clickable"><icon-edit /></icon-base>
    </div>
    <h2>Settings</h2>
    <div class="horizontal space-out center-line color-grey rounded width-90 padding-10 padding-vertical-20">
      <h3>
        Set the Time:
      </h3>
      <date-picker v-model="range" mode="dateTime" :update-on-input="false" is24hr is-range>
        <template v-slot="{ inputValue, inputEvents }">
          <div class="horizontal center-line">
            <input
              :value="inputValue.start"
              v-on="inputEvents.start"
            />
            <icon-base class="box-40"><icon-arrow-right /></icon-base>
            <input
              :value="inputValue.end"
              v-on="inputEvents.end"
            />
          </div>
        </template>
      </date-picker>
    </div>
    <h2>Invited Voters</h2>
    <div class="color-grey rounded width-90 padding-10">
      <div class="horizontal space-out center-line padding-vertical-20">
        <h3>{{voters.length}} users:</h3>
        <icon-base @click="addingUsers = true" class="box-40 rounded color-green clickable"><icon-plus-thick /></icon-base>
      </div>
      <div v-for="(user, ind) in voters" :key="ind" class="color-grey rounded horizontal space-out center-line padding-vertical-10 clickable">
        <h4>{{user.name}}</h4>
        <icon-base class="box-30 rounded color-red" @click="removeVoter(ind)"><icon-cross /></icon-base>
      </div>
    </div>
    <input type="submit" @click="startVoting" class="width-100 top-space-10 clickable" value="Start the voting"/>
    <pop-up v-show="addingUsers" @close="addingUsers = false" text="Add users">
      <div style=" max-height: 300px; overflow-y: auto; overflow-x: hidden">
        <div style="width: 400px; padding: 20px;">
          <h3 v-for="(user, ind) in allUsers" :key="ind" class="color-green rounded top-space-10 width-80 padding-vertical-20 clickable" @click="addVoter(ind)">
            {{user.name}}
          </h3>
        </div>
      </div>
    </pop-up>
  </div>
</template>
<script>
  import IconBase from '../components/IconBase'
  import IconEdit from '../components/icons/IconEdit'
  import IconPlusThick from '../components/icons/IconPlusThick'
  import IconCross from '../components/icons/IconCross'
  import IconArrowRight from '../components/icons/IconArrowRight'
  import TemplateForm from "../components/TemplateForm"
  import TemplateInfo from "../components/TemplateInfo"
  import PopUp from "../components/PopUp"
  import { DatePicker } from 'v-calendar';

  
  import * as services from '../services'

  export default {
    components: {
      IconBase,
      IconEdit,
      IconPlusThick,
      IconCross,
      IconArrowRight,
      PopUp,
      TemplateForm,
      TemplateInfo,
      DatePicker
    },
    props: {
      me: Object
    },
    data () {
      return {
        template: Object,
        voters: [],
        allUsers: [],
        ready: false,
        editQuestions: false,
        addingUsers: false,
        range: {
          start: new Date(),
          end: new Date(),
        },
        // now: new Date(),
      }
    },
    created() {
      
      services.templateService.get(this.$route.params.id)
      .then(res => {
        this.template = res;
        this.ready = true;
      })
      services.personService.find({
        query: {
          $select: ['name', '_key']
        }
      })
      .then(res => {
        this.allUsers = res.data;
        console.log(this.allUsers);
      })
    },
    mounted () {
      // set default time
      const now = new Date().getTime()
      const nearestHour = Math.ceil(now/3600000) * 3600000
      this.range.start.setTime(nearestHour);
      this.range.end.setTime(nearestHour + 2 * 3600000);
    },
    methods: {
      addVoter(ind){
        this.voters.push(this.allUsers[ind]);
        this.allUsers.splice(ind, 1);
        if(!this.allUsers.length){
          this.addingUsers = false;
        }
      },
      removeVoter(ind){
        this.allUsers.push(this.voters[ind]);
        this.voters.splice(ind, 1);
      },
      startVoting(){
        const Ids = this.voters.map(v => v._key);
        services.votingService.create({
          title: this.template.title,
          description: this.template.description,
          questions: this.template.questions,
          voters: Ids,
          admins: [this.me._key],
          start: this.range.start.getTime(),
          end: this.range.end.getTime(),
        }).then(() => {
          console.log('sent');
        })
      }
    } 
  }
</script>