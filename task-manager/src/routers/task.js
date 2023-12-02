const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
  const currentUserId = req.user._id

  const task = new Task({
    owner: currentUserId,
    ...req.body,
  })

  try {
    await task.save()
    res.status(201).send(task)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.get('/tasks', auth, async (req, res) => {
  const match = {}

  // 'completed' comes as a string ('true' or 'false')
  if (req.params.completed) {
    match.completed = req.params.completed === 'true'
  }

  try {
    // "populate()" was setup in User model as a "virtual" relation
    // and populates the tasks for a given user (using uder's _id)
    // "match" include additional conditions to look for the tasks
    await req.user.populate({
      path: 'tasks',
      match,
    }).execPopulate()

    res.send(req.user.tasks)
  } catch (err) {
    res.status(500).send(err)
  }
})

router.get('/tasks/:id', auth, async (req, res) => {
  const currentUserId = req.user._id
  const taskId = req.params.id

  try {
    const task = await Task.findOne({
      owner: currentUserId,
      _id: taskId,
    })
    if (!task) {
      res.status(404).send()
      return
    }
    res.send(task)
  } catch (err) {
    res.status(500).send(err)
  }
})

router.patch('/tasks/:id', auth, async (req, res) => {
  const taskId = req.params.id
  const currentUserId = req.user._id

  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']

  if (!updates.every((u) => allowedUpdates.includes(u))) {
    res.status(400).send({error: `Invalid param, can only update: ${allowedUpdates.join(', ')}`})
    return
  }

  try {
    const task = await Task.findOne({
      owner: currentUserId,
      _id: taskId,
    })
    if (!task) {
      res.status(404).send()
      return
    }

    updates.forEach((update) => task[update] = req.body[update])
    await task.save()

    res.send(task)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.delete('/tasks/:id', auth, async (req, res) => {
  const currentUserId = req.user._id
  const taskId = req.params.id
  
  try {
    const task = await Task.findOneAndDelete({
      owner: currentUserId,
      _id: taskId,
    })
    if (!task) {
      res.status(404).send()
      return
    }

    res.send(task)
  } catch (err) {
    res.status(500).send(err)
  }
})

module.exports = router
