<template>
  <div id="container" class="vertical">
    <h1>This is the creating page</h1>
    <form v-if="ready" @submit.prevent="getNumOfPeople" class="color-grey rounded width-90 padding-10 padding-vertical-20 vertical">
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
      <input type="checkbox" class="margin-horizontal-10" v-model="local"/>
      <h3>Scoped down to local church</h3>
    </div>
    <div class="horizontal padding-vertical-20">
      <input type="checkbox" class="margin-horizontal-10" v-model="roleSelect"/>
      <h3>Select by role</h3>
    </div>
    <div v-if="roleSelect" class="vertical width-80">
      <div v-for="(role, ind) in $user.roles" :key="ind" class="go-start">
        <input type="radio" :value="role.id" :id="role" class="margin-horizontal-10" v-model="selectedRole"/>
        <label for="jack">{{role.name}}</label>
      </div>
    </div>
    <input type="submit" value="Start"/>
    </form>
  </div>
</template>
<script>
  import { DatePicker } from 'v-calendar';

  export default {
    name: "Create",
    components: {
      DatePicker
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
        selectedRole: this.$user.roles[0].id,
        numOfVoters: 0
      }
    },
    created() {
      // this.$client.service('members').find({
      //   query: {
      //     $limit: 0,
      //     churchID: this.$user.churchID
      //   }
      // })
      // // this.$client.services.members.get(54512)
      // .then(res => {
      //   console.log(res);
      // })
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
        if(this.roleSelect)
          query.role = this.selectedRole;
        const res = await this.$client.service('members').find({
          query
        })
        console.log(res);
        this.numOfVoters = res.total;
      },
      startMeeting(){
        this.$client.service('meetings').create({
          title: this.title,
          description: this.description,
          startTime: this.startTime.getTime(),
          endTime: this.endTime.getTime(),
          scheduledStart: this.scheduledStart,
          scheduledEnd: this.shceduledEnd,
          publicVoting: this.publicVoting,
          local: this.local,
          roleSelect: this.roleSelect,
          selectedRoles: this.selectedRoles,
        })
      }
    }
  }
</script>