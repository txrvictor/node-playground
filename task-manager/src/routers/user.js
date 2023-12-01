const express = require('express')
const User = require('../models/user')

const router = new express.Router()

router.post('/users', async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    res.status(201).send(user) // 201: created
  } catch (err) {
    res.status(400).send(err) // 400: client request error
  }
})

router.get('/users', async (_, res) => {
  try {
    const users = await User.find({})
    res.send(users)
  } catch (err) {
    res.status(500).send(err) // server error
  }
})

router.get('/users/:id', async (req, res) => {
  const userId = req.params.id
  try {
     // no need to convert _id to object with mongoose
    const user = await User.findById(userId)
    if (!user) {
      res.status(404).send() // 404: not found
      return
    }
    res.send(user)
  } catch (err) {
    res.status(500).send(err)
  }
})

router.patch('/users/:id', async (req, res) => {
  const userId = req.params.id
  const updates = req.body
  const allowedUpdates = ['name', 'email', 'password', 'age']

  // check if client sent some update which is not allowed
  if (!Object.keys(updates).every((u) => allowedUpdates.includes(u))) {
    res.status(400).send({error: `Invalid param, can only update: ${allowedUpdates.join(', ')}`})
    return
  }

  try {
    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true, // returns the new user -after- the update
      runValidators: true,
    })

    if (!user) {
      res.status(404).send()
      return
    }
    res.send(user)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.delete('/users/:id', async (req, res) => {
  const userId = req.params.id
  try {
    const user = await User.findByIdAndDelete(userId)
    if (!user) {
      res.status(404).send()
      return
    }
    res.send(user)
  } catch (err) {
    res.status(500).send(err)
  }
})

module.exports = router
