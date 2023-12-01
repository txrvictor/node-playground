const mongoose = require('mongoose')

const DATABASE_NAME = 'task-manager-api'
const CONNECTION_URL = `mongodb://127.0.0.1:27017/${DATABASE_NAME}`

mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})
