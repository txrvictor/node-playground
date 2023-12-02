const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const testUserId = new mongoose.Types.ObjectId()
const testUser = {
  _id: testUserId,
  name: 'John',
  email: 'john@email.com',
  password: 'SecreTpasS!',
  tokens: [{
    token: jwt.sign({_id: testUserId}, process.env.JWT_SECRET),
  }]
}

const testUserTwoId = new mongoose.Types.ObjectId()
const testUserTwo = {
  _id: testUserTwoId,
  name: 'Sara',
  email: 'sara@email.com',
  password: 'SaraSecreTpasS!',
  tokens: [{
    token: jwt.sign({_id: testUserTwoId}, process.env.JWT_SECRET),
  }]
}

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Test Task One',
  completed: false,
  owner: testUserId,
}

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Test Task Two',
  completed: true,
  owner: testUserId,
}

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Test Task Three',
  completed: true,
  owner: testUserTwoId,
}

// clean up before each test and setup some users
const setupDatabase = async () => {
  await User.deleteMany()
  await Task.deleteMany()
  await new User(testUser).save()
  await new User(testUserTwo).save()
  await new Task(taskOne).save()
  await new Task(taskTwo).save()
  await new Task(taskThree).save()
}

module.exports = {
  testUserId,
  testUser,
  testUserTwoId,
  testUserTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase,
}
