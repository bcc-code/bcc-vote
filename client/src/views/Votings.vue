<template>
  <div id="container" class="width-100 vertical">
    <h1>Your ({{me.name}}) active votings</h1>
    <router-link v-for="(voting, ind) in votings" :key="ind" :to="'/votings/vote-'+voting._key" class="color-grey rounded width-90 top-space-10">
      <div >
        <template-info :title="voting.title" :questionNum="voting.questions.length"></template-info>
      </div>
    </router-link>
    <router-link v-for="(voting, ind) in votingsAdmin" :key="ind" :to="'/votings/administer-'+voting._key" class="color-yellow rounded width-90 top-space-10">
      <div >
        <template-info :title="voting.title" :questionNum="voting.questions.length"></template-info>
      </div>
    </router-link>
    <!-- <div v-for="(template, ind) in templates" :key="ind" class="color-grey rounded width-90 top-space-10">
      <div class="horizontal space-out center-line">
        <template-info :template="template"></template-info>
        <div class="horizontal space-out">
          <router-link :to="'/votings/initialize-'+template._id" class="margin-horizontal-10 box-50 rounded color-green">
            <icon-base class="box-50" iconColor="#2c3e50"><icon-arrow-right /></icon-base>
          </router-link>
          <router-link :to="'/templates/edit-'+template._id" class="margin-horizontal-10 rounded box-50 color-yellow">
            <icon-base class="box-50" iconColor="#2c3e50"><icon-edit /></icon-base>
          </router-link>
          <div @click="deleteTemplate(ind)" class="margin-horizontal-10 rounded box-50 color-red clickable">
            <icon-base class="box-50"><icon-cross /></icon-base>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>


<script>

// import IconBase from '../components/IconBase'
// import IconEdit from '../components/icons/IconEdit'
// import IconArrowRight from '../components/icons/IconArrowRight'
// import IconPlus from '../components/icons/IconPlus'
// import IconCross from '../components/icons/IconCross'

import TemplateInfo from '../components/TemplateInfo'

import * as services from '../services'

export default {
  components: {
    // IconBase,
    // IconPlus,
    // IconArrowRight,
    // IconEdit,
    // IconCross,
    TemplateInfo
  },
  data(){
    return {
      votings: [],
      votingsAdmin: [],
    }
  },
  props: {
    me: Object
  },
  mounted (){
    console.log('created');
    if(!this.me._id)
      this.$router.push('/')
    else{
      console.log(this.me.votings.length)
      services.votingService.find({
        query: {
          _key: {
            $in: this.me.votings
          }
        }
      }).then(res => {
        this.votings = res.data;
      })
      services.votingService.find({
        query: {
          _key: {
            $in: this.me.votingsAdmin
          }
        }
      }).then(res => {
        this.votingsAdmin = res.data;
      })
    }
  },
  methods: {
    deleteTemplate(ind){
      services.templateService.remove(this.templates[ind]._id)
      .then(() => {
        this.templates.splice(ind, 1);
      })
    }
  },
  emits: ['error']
}
</script>