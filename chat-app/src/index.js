const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const checkAndExec = require('./utils/func')
const {generateMessage, generateLocationMessage} = require('./utils/messages')
const {addUser, getUsersInRoom, getUser, removeUser} = require('./utils/users')

const PORT = process.env.PORT || 3000

const systemName = 'Chat App'
const publicDirPath = path.join(__dirname, '../public')

const app = express()

// does not change how express work, just gives us access to
// the raw http node server instance used by express behind
// the scene
const server = http.createServer(app)

// socketio required the raw http server instance and not 
// the express instance
const io = socketio(server)

app.use(express.static(publicDirPath))

const updateRoomData = (room) => {
  const users = getUsersInRoom(room)

  // update people in the chat room
  io.to(room).emit('roomData', {room, users})
}

io.on('connection', (socket) => {
  console.log('New websocket connection!')

  socket.on('join', (options, ackCallback) => {
    // id will be the unique socket identifier
    const {error, user} = addUser({id: socket.id, ...options})
    if (error) {
      return checkAndExec(ackCallback, error)
    }

    // set this socket to a specific 'room' which will allow us to send 
    // messages only to other sockets in the same room
    socket.join(user.room)

    socket.emit('message', generateMessage(systemName, 'Greetings :)'))
    socket.broadcast.to(user.room).emit(
      'message',
      generateMessage(systemName, `${user.username} has joined the chat!`),
    )

    // update people in the chat room
    updateRoomData(user.room)

    checkAndExec(ackCallback)
  })

  socket.on('sendMessage', (message, ackCallback) => {
    const user = getUser(socket.id)
    
    const filter = new Filter()
    if (filter.isProfane(message)) {
      return checkAndExec(ackCallback, 'Profanity not allowed!')
    }

    io.to(user.room).emit('message', generateMessage(user.username, message))
    checkAndExec(ackCallback)
  })

  socket.on('sendLocation', (location, ackCallback) => {
    const user = getUser(socket.id)

    io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, location))
    checkAndExec(ackCallback)
  })

  socket.on('disconnect', () => {
    const user = removeUser(socket.id)
    if (user) {
      io.to(user.room).emit(
        'message',
        generateMessage(systemName, `${user.username} left the chat.`),
      )

      // update people in the chat room
      updateRoomData(user.room)
    }
  })
})

server.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`)
})
