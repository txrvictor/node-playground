const {MongoClient} = require('mongodb')

const CONNECTION_URL = 'mongodb://127.0.0.1:27017'
const DATABASE_NAME = 'task-manager'

MongoClient.connect(CONNECTION_URL, { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
 }, (error, client) => {
  if (error) {
    console.log('Connection to DB failed: ', error)
    return
  }
 
  const db = client.db(DATABASE_NAME)
  console.log({db})
})
