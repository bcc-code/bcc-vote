<template>
  <div id = "app">
    <Topbar></Topbar>
    <router-view  @error="showError" @success="showSuccess" ></router-view>
    <Infobox v-if="infoMessage" :content="infoMessage" :type="infoType"></Infobox>
  </div>
</template>

<script>

  import Topbar from './components/Topbar'
  import Infobox from './components/Infobox'

  export default {
    name: "app",
    components: { Topbar, Infobox},

    data () {
      return {
        infoMessage: '',
        infoType: 'error',
        infoTimer: undefined
      }
    },
    methods: {
      showInfo (msg, type) {
        this.infoMessage = msg
        this.infoType = type
        clearTimeout(this.infoTimer)
        this.infoTimer = setTimeout(() => {
          this.infoMessage = ''
        }, 3000)
      },
      showError (msg) {
        this.showInfo(msg, 'error')
      },
      showSuccess (msg) {
        this.showInfo(msg, 'success')
      },
      login (me) {
        this.me = me;
        this.$router.push('/')
      },
      register (me) {
        
        this.login(me)
        this.showInfo('successfully registered as ' + this.me.name, 'success')
      },
      logout () {
        this.me = {}
      }
    }
    
  }
</script>

<style>
  #app {
    width: 100vw;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  #container{
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    width: 80vw;
    max-width: 1024px;
  }


  body {
    margin: 0;
    overflow-x: hidden;
  }

  input, textarea{
    padding: 10px;
    font-size: 20px;
    margin: 5px 0;
    border-radius: 20px;
  }
  input, textarea{
    border: 2px solid black;
  }
  input:focus, textarea:focus{
    border-color: blue;
    background-color: rgb(225, 236, 255);
  }
  textarea{
    font-family: inherit;
    resize: vertical;
  }
  h2, h3{
    margin: 0;
    padding: 10px 0;
    text-align: left;
  }
  h4{
    margin: 0;
    padding: 5px 0;
    text-align: left;
  }
  .clickable:hover {
    cursor: pointer;
  }
  .horizontal{
      display: flex;
      flex-direction: row;
  }
  .vertical{
    display: flex;
    flex-direction: column;
  }
  .space-out{
    justify-content: space-between;
  }
  .space-around{
    justify-content: space-around;
  }
  .center-line{
    align-items: center;
  }
  .go-center{
    align-self: center;
  }
  .go-start{
    align-self: flex-start;
  }
  .go-end{
    align-self: flex-end;
  }
  .width-100{
    width: 100%;
  }
  .width-90{
    width: 90%;
    padding-left: 5%;
    padding-right: 5%;
  }
  .width-80{
    width: 80%;
    padding-left: 10%;
    padding-right: 10%;
  }
  .box-50{
    width: 50px;
    height: 50px;
  }
  .box-40{
    width: 40px;
    height: 40px;
  }
  .box-30{
    width: 30px;
    height: 30px;
  }
  .padding-vertical-20{
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .padding-vertical-10{
    padding-top: 5px;
    padding-bottom: 5px;
  }
  .padding-all-20{
    padding: 10px;
  }
  .padding-all-10{
    padding: 5px;
  }
  .top-space-10{
    margin-top: 10px;
  }
  .top-space-20{
    margin-top: 20px;
  }
  .margin-horizontal-10{
    margin: 0 5px;
  }
  .space-10{
    height: 10px;
  }
  .space-20{
    height:20px;
  }
  .space-30{
    height: 30px;
  }
  .rounded{
    border-radius: 20px;
  }
  .color-grey{
    background-color: #bbb;
  }
  .color-dark-grey{
    background-color: #777;
  }
  .color-green {
    background-color: #77dd77;
  }
  .color-green:hover{
    background-color: #68be68;
  }
  .color-yellow{
    background-color: #f9d71c;
  }
  .color-yellow:hover{
    background-color: #f9be1c;
  }
  .color-red {
    background-color: #ec3f36;
  }
  .color-red:hover{
    background-color: #cf352e;
  }
  
  
  
  
  
  .big-text{
    font-size: 25px;
    font-weight: 600;
  }
  .medium-text{
    font-size: 20px;
    font-weight: 600;
  }

  .unselectable {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
</style>
