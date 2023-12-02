const express = require('express')
require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()

// config express to automatically parse json received from API
app.use(express.json())

app.use(userRouter)
app.use(taskRouter)

module.exports = app
