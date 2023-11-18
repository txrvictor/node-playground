const fs = require('fs')

const FILE_NAME = '1-json.json'

const dataBuffer = fs.readFileSync(FILE_NAME)
const dataJSON = dataBuffer.toString()
const user = JSON.parse(dataJSON)

user.name = 'Gunther'
user.age = 54

const userJSON = JSON.stringify(user)
fs.writeFileSync(FILE_NAME, userJSON)
