const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
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

router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user?.avatar) {
      throw new Error()
    }

    // sharp lib convert all saved image to png
    res.set('Content-Type', 'image/png')

    res.send(user.avatar)
  } catch (err) {
    res.status(400).send()
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

const upload = multer({
  limits: {
    fileSize: 1000000, // 1 Mb
  },
  fileFilter(_, file, callback) {
    const regex = /\.(jpg|jpeg|png)$/
    if (!file.originalname.match(regex)) {
      return callback(new Error('Please upload an image'))
    }

    // success
    callback(undefined, true)
  }
})
const multerErrorHandler = (error, req, res, next) => {
  res.status(400).send({error: error.message})
}
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  // multer pass this down if "dest" was not given as config option to multer()
  const imgBuffer = req.file.buffer

  // use sharp lib to optimize image
  const buffer = await sharp(imgBuffer)
    .resize({width: 250, height: 250}) // set a standard size
    .png() // convert to png any type of img
    .toBuffer()
  
  req.user.avatar = buffer
  await req.user.save()

  res.send()
}, multerErrorHandler)

router.delete('/users/me/avatar', auth, async (req, res) => {
  const user = req.user

  try {
    user.avatar = undefined
    await user.save()

    res.send()
  } catch (err) {
    res.status(500).send(err)
  }
})

module.exports = router
