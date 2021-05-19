// /services/index.js
import io from 'socket.io-client'
import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'


const socket = io('http://192.168.0.107:3030')

export const app = feathers().configure(socketio(socket))
  // repeat this line for every service in our backend
export const messageService = app.service('messages')
export const personService = app.service('person')
export const templateService = app.service('templates')
export const votingService = app.service('votings')
export const votierService = app.service('voter')

// export const userService = app.service('users')

// in  actions.js, your component and anywhere else you need your services:
// import messageService from './services';

// or load all services at once: import * as services from './services'
// and access them as services.messageService etc.
