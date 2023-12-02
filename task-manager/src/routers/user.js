const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/users', async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()

    // create a token for the newly generated user
    const token = await user.generateAuthToken()

    res.status(201).send({user, token}) // 201: created
  } catch (err) {
    res.status(400).send(err) // 400: client request error
  }
})

router.post('/users/login', async (req, res) => {
  const {email, password} = req.body
  try {
    const user = await User.findByCredentials(email, password)
    const token = await user.generateAuthToken()
    
    res.send({user, token})
  } catch (err) {
    res.status(400).send(err)
  }
})

// -- Authenticated routes

router.post('/users/logout', auth, async (req, res) => {
  try {
    const user = req.user
    const currentToken = req.token

    // filter out the token being used
    user.tokens = user.tokens.filter((t) => {
      return t.token !== currentToken
    })

    await user.save()

    res.send()
  } catch (err) {
    res.status(500).send()
  }
})

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    const user = req.user
    user.tokens = [] // clean all tokens
    await user.save()

    res.send()
  } catch (err) {
    res.status(500).send()
  }
})

router.get('/users/me', auth, async (req, res) => {
  // send own user's profile
  res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
  const user = req.user

  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']

  // check if client sent some update which is not allowed
  if (!updates.every((u) => allowedUpdates.includes(u))) {
    res.status(400).send({error: `Invalid param, can only update: ${allowedUpdates.join(', ')}`})
    return
  }

  try {
    updates.forEach((update) => user[update] = req.body[update])
    await user.save()

    res.send(user)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.delete('/users/me', auth, async (req, res) => {
  const user = req.user

  try {
    await user.remove()

    // send back deleted user
    res.send(user)
  } catch (err) {
    res.status(500).send(err)
  }
})

module.exports = router
