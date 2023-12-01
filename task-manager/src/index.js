const express = require('express')
require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const PORT = process.env.PORT || 3000

// config express to automatically parse json received from API
app.use(express.json())

app.use(userRouter)
app.use(taskRouter)

app.listen(PORT, () => {
  console.log(`Server up and running on port: ${PORT}`)
})
