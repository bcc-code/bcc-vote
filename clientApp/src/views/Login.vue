<template>
  <div id="container" class="vertical">
    <input id="name" type="text" v-model="name" placeholder='name' @keyup.enter="login"/>
    <button @click="login" class="go-end">Log in</button>
  </div>  

</template>

<script>
  import * as services from '../services'

  export default {
    data () {
      return {
        name: '',
        password: ''
      }
    },
    mounted () {
      this.focusName()
    },
    methods: {
      focusName () {
        document.getElementById('name').focus()
      },
      clearFields () {
        this.name = ''
        this.password = ''
      },
      login () {
        services.personService.find({
          query: {
            $limit: 1,
            name: this.name,
          }}).then(me => {
            console.log(me);
            if (me.total > 0) {
              const identity = me.data[0]
              // console.log('log me in')
              this.$emit('logged', identity)
            } else {
              this.register()
            }
          })
      },
      register () {
        services.personService.create({
          name: this.name})
          .then(identity => {
            this.$emit('registered', identity)
          })
          .catch(err => {
            this.showErr(err.message)
          })
      },
      showErr (err) {
        // console.log(err)
        this.$emit('error', err)
      }
    },
  }
</script>
