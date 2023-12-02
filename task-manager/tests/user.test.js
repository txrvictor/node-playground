const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')

const User = require('../src/models/user')

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

// clean up before each test and setup an user
beforeEach(async () => {
  await User.deleteMany()
  await new User(testUser).save()
})

test('Should signup a new user', async () => {
  const response = await request(app).post('/users').send({
    name: 'Inigo',
    email: 'inigo@montoya.com',
    password: 'SomePass1234',
  }).expect(201)

  // verify if user was saved in DB
  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()

  // make sure response body is correct
  expect(response.body).toMatchObject({
    user: {
      name: 'Inigo',
      email: 'inigo@montoya.com',
    },
    token: user.tokens[0].token,
  })

  // check if pw was hashed
  expect(user.password).not.toBe('SomePass1234')
})

test('Should login existing user', async () => {
  const response = await request(app).post('/users/login').send({
    email: testUser.email,
    password: testUser.password,
  }).expect(200)

  const user = await User.findById(testUserId)

  // check if second generated login token is valid
  expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login wrong password from user', async () => {
  await request(app).post('/users/login').send({
    email: testUser.email,
    password: 'whateverpassword',
  }).expect(400)
})

test('Should not login nonexistent user', async () => {
  await request(app).post('/users/login').send({
    email: 'notanuser@email.com',
    password: 'whateverpassword',
  }).expect(400)
})

test('Should get profile for user', async () => {
  await request(app).get('/users/me')
    .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
  await request(app).get('/users/me')
    .send()
    .expect(401)
})

test('Should delete account for user', async () => {
  await request(app).delete('/users/me')
    .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
    .send()
    .expect(200)

  // confirm if user was deleted
  const user = await User.findById(testUserId)
  expect(user).toBeNull()
})

test('Should not delete account unauthenticated user', async () => {
  await request(app).delete('/users/me')
    .send()
    .expect(401)
})

test('Should upload avatar image', async () => {
  await request(app).post('/users/me/avatar')
    .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    expect(200)

  // make sure there was some buffer uploaded to avatar
  const user = await User.findById(testUserId)
  expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
  await request(app).patch('/users/me')
    .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
    .send({name: 'Inigo Montoya'})
    .expect(200)

  const user = await User.findById(testUserId)
  expect(user.name).toBe('Inigo Montoya')
})

test('Should not update invalid user fields', async () => {
  await request(app).patch('/users/me')
    .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
    .send({phone: '123456'})
    .expect(400)
})
