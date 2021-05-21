<template>
  <div id="container" class="vertical">
    <h1>This is the creating page</h1>
    <form v-if="ready" @submit.prevent="startMeeting" class="color-grey rounded width-90 padding-10 padding-vertical-20 vertical">
    <label class="big-text top-space-10">Title:</label>
    <input name="title" type="text" placeholder="title" v-model="title"/>
    <label class="big-text top-space-10">Description:</label>
    <textarea name="title" type="textarea" placeholder="description" v-model="description"/>
    <h2>Settings</h2>
    
    <div class="horizontal space-out center-line ">
      <div class="horizontal padding-vertical-20">
        <input type="checkbox" class="margin-horizontal-10" v-model="scheduledStart"/>
        <h3>Scheduled start</h3>
      </div>
      <date-picker v-if="scheduledStart" v-model="startTime" mode="dateTime" :update-on-input="false" is24hr>
        <template v-slot="{ inputValue, inputEvents }">
          <input :value="inputValue" v-on="inputEvents"/>
        </template>
      </date-picker>
    </div>
    <div class="horizontal space-out center-line ">
      <div class="horizontal padding-vertical-20">
        <input type="checkbox" class="margin-horizontal-10" v-model="scheduledEnd"/>
        <h3>Scheduled end</h3>
      </div>
      <date-picker v-if="scheduledEnd" :min="startTime" v-model="endTime" mode="dateTime" :update-on-input="false" is24hr>
        <template v-slot="{ inputValue, inputEvents }">
          <input :value="inputValue" v-on="inputEvents"/>
        </template>
      </date-picker>
    </div>
    <div class="horizontal padding-vertical-20">
      <input type="checkbox" class="margin-horizontal-10" v-model="publicVoting"/>
      <label class="medium-text">Public Results</label>
    </div>
    <div class="horizontal width-100 space-out">
    <h2>Invited Voters</h2>
    <h2 v-if="numOfVoters">Found {{numOfVoters}} Voters</h2>
    </div>
    <div class="horizontal padding-vertical-20">
      <input type="radio" class="margin-horizontal-10" v-model="local" :value="true" @change="getNumOfPeople"/>
      <h3>Scoped down to local church</h3>
    </div>
    <div class="horizontal padding-vertical-20">
      <input type="radio" class="margin-horizontal-10" v-model="local" :value="false" @change="getNumOfPeople"/>
      <h3>Select by role</h3>
    </div>
    <div v-if="!local" class="vertical width-80">
      <div v-for="(role, ind) in $user.roles" :key="ind" class="go-start">
        <input type="radio" :value="role.id" :id="role" class="margin-horizontal-10" v-model="selectedRole" @change="getNumOfPeople"/>
        <label for="jack">{{role.name}}</label>
      </div>
    </div>
    <div class="horizontal padding-vertical-20">
      <input type="checkbox" class="margin-horizontal-10" v-model="isMinAge"/>
      <h3>Minimal age</h3>
      <numeric-input :min="0" :max="maxAge" v-if="isMinAge" v-model="minAge" class="margin-horizontal-10" @change="getNumOfPeople"></numeric-input>
    </div>
    <div class="horizontal padding-vertical-20">
      <input type="checkbox" class="margin-horizontal-10" v-model="isMaxAge" @change="getNumOfPeople"/>
      <h3>Maximal age</h3>
      <numeric-input :min="minAge" v-if="isMaxAge" v-model="maxAge" class="margin-horizontal-10" @change="getNumOfPeople"></numeric-input>
    </div>
    <input type="submit" value="Start"/>
    

    </form>
  </div>
</template>
<script>
  import { DatePicker } from 'v-calendar';
import NumericInput from '../components/NumericInput.vue';

  export default {
    name: "Create",
    components: {
      DatePicker,
        NumericInput
    },
    data () {
      return {
        title: '',
        description: '',
        startTime: new Date(),
        endTime: new Date(),
        ready: false,
        scheduledStart: false,
        scheduledEnd: false,
        publicVoting: false,
        local: true,
        roleSelect: false,
        isMinAge: false,
        minAge: 0,
        isMaxAge: false,
        maxAge: 100,
        selectedRole: this.$user.roles[0].id,
        numOfVoters: 0
      }
    },
    created() {
      this.getNumOfPeople();
    },
    mounted () {
      // set default time
      const now = new Date().getTime()
      const nearestHour = Math.ceil(now/3600000) * 3600000
      console.log(now);
      console.log(nearestHour);
      this.startTime.setTime(nearestHour);
      this.endTime.setTime(nearestHour + 2 * 3600000);
      this.ready = true;
    },
    methods: {
      async getNumOfPeople(){
        const query = {
          $limit: 0,
        }
        if(this.local)
          query.churchID = this.$user.churchID
        if(!this.local)
          query.role = this.selectedRole;
        if(this.isMinAge)
          query.minAge = this.minAge;
        if(this.isMaxAge)
          query.maxAge = this.maxAge;
        const res = await this.$client.service('members').find({
          query
        })
        console.log(res);
        this.numOfVoters = res.total;
      },
      startMeeting(){
        const data = {
          title: this.title,
          description: this.description,
          public: this.public
        }
        if(this.scheduledStart)
          data.startTime = this.startTime.getTime();
        if(this.scheduledEnd)
          data.endTime = this.endTime.getTime();
        if(this.isMinAge)
          data.minAge = this.minAge;
        if(this.isMaxAge)
          data.maxAge = this.maxAge;
        if(this.local)
          data.churchID = this.$user.churchID;
        else
          data.role = this.selectedRole;
        this.$client.service('meetings').create(data);
      }
    }
  }
</script>