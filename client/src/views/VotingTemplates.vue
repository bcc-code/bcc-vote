<template>
  <div id="container" class="width-100 vertical">
    <h1>Your ({{me.name}}) voting templates</h1>
    <div v-for="(template, ind) in templates" :key="ind" class="color-grey rounded width-90 top-space-10">
      <div class="horizontal space-out center-line">
        <template-info :title="template.title" :questionNum="template.questions.length"></template-info>
        <div class="horizontal space-out">
          <router-link :to="'/votings/initialize-'+template._key" class="margin-horizontal-10 box-50 rounded color-green">
            <icon-base class="box-50" iconColor="#2c3e50"><icon-arrow-right /></icon-base>
          </router-link>
          <router-link :to="'/templates/edit-'+template._key" class="margin-horizontal-10 rounded box-50 color-yellow">
            <icon-base class="box-50" iconColor="#2c3e50"><icon-edit /></icon-base>
          </router-link>
          <div @click="deleteTemplate(ind)" class="margin-horizontal-10 rounded box-50 color-red clickable">
            <icon-base class="box-50"><icon-cross /></icon-base>
          </div>
        </div>
      </div>
    </div>
    <router-link to='/templates/create' class="width-100 top-space-10 rounded color-green">
      <icon-base class="box-50 margin-horizontal-10" iconColor="#2c3e50"><icon-plus /></icon-base>
    </router-link>
  </div>
</template>


<script>

import IconBase from '../components/IconBase'
import IconEdit from '../components/icons/IconEdit'
import IconArrowRight from '../components/icons/IconArrowRight'
import IconPlus from '../components/icons/IconPlus'
import IconCross from '../components/icons/IconCross'

import TemplateInfo from '../components/TemplateInfo'

import * as services from '../services'

export default {
  components: {
    IconBase,
    IconPlus,
    IconArrowRight,
    IconEdit,
    IconCross,
    TemplateInfo
  },
  data(){
    return {
      templates: []
    }
  },
  props: {
    me: Object
  },
  created (){
    if(!this.me._id)
      this.$router.push('/')
    else{
      services.templateService.find({
        query: {
          owner: this.me._id
      }})
      .then(t => {
        this.templates = t.data;
      })
      .catch(err => {
        this.$emit('error', err.message);
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