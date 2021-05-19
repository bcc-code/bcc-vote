<template>
  <div id="container" class="vertical">
    <input id="text" type="text" placeholder="Enter message" v-model="newMessage" @keyup.enter="tryAddMessage">
    <button type="submit" @click="tryAddMessage" class="go-end">Add message</button>
    <div id="messages">
      <div v-for="message in messagesClient" :key="message._id">
        <div @click="tryRemoveMessage(message)" class="message-class">{{ message.author }}: {{ message.text }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as services from '../services'

  export default {
    props: {
      me: Object
    },
    data () {
      return {
        newMessage: '',
        messagesClient: []
      }
    },
    mounted () {
      console.log("created");
      console.log('ready')
      // load messages
      services.messageService.find({query: {
        $sort: {
          createdAt: 1
        }
      }}).then(messages => {
        this.addMessages(messages)
      })
      console.log(this.messagesClient)
      services.messageService.on('created', this.addMessage)
      services.messageService.on('removed', this.removeMessage)

      this.focusOnText()
    },

    methods: {
      addMessages (messages) {
        messages.data.forEach(m => {
          this.addMessage(m)
        })
      },
      addMessage (message) {
        console.log('message!')
        this.messagesClient.push(message)
      },
      removeMessage (message) {
        console.log('removing ', message._id)
        const index = this.messagesClient.findIndex(m => m._id === message._id)
        console.log(index)
        if (index > -1) {
          this.messagesClient.splice(index, 1)
        }
        console.log(this.messagesClient)
      },
      tryAddMessage () {
        if (this.newMessage.trim()) {
          // Persist a new message to the db
          services.messageService.create({ author: this.me.name, text: this.newMessage }).then(this.newMessage = '')
        }
      },
      tryRemoveMessage (message) {
        // Remove message from the db
        console.log(message._id)
        services.messageService.remove(message._id)
      },
      focusOnText () {
        document.getElementById('text').focus()
      }
    }
  }
</script>

<style scoped>
  .message-class{
    font-size: 20px;
    padding: 15px 0;
    margin: 5px 0;
    border-radius: 20px;
    width: 100%;
    background-color: aquamarine;
  }
  #messages{
    width: 100%;
  }
  #messages:hover{
    cursor: pointer;
  }
</style>
