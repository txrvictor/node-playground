const mongoose = require('mongoose')

const CONNECTION_URL = process.env.MONGODB_URL

mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})
