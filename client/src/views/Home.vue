<template>
  <div id="container" class="container vertical">
    <router-link class="width-80" to="/create">
    <input type="submit" class="width-80" v-if="$user.administrator" value="create a meeting"/>
    </router-link>
    <img alt="Vue logo" src="../assets/logo.png">
    <div>{{$user}}</div>
    <div @click="makeRequest">Make request</div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  // components: {
  //   HelloWorld
  // }
  methods: {
    log () {
      console.log(this.$user);
    },
    async makeRequest(){
      console.log('making request');
      // const res = await this.$client.service('members').find()
      // console.log(res);
      // this.$client.service('users').create(res);
      const res = await this.$client.service('users').find({
        query: {
          Developer: true,
        }
      });
      console.log(res);
    }
  }
}
</script>
