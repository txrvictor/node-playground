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
  const sort = {}
  
  const {completed, limit, skip, sortBy} = req.query

  // 'completed' comes as a string ('true' or 'false')
  if (completed) {
    match.completed = completed === 'true'
  }

  // expects the format: "sortBy=createdAt:desc"
  if (sortBy) {
    const parts = sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }

  try {
    // "populate()" was setup in User model as a "virtual" relation
    // and populates the tasks for a given user (using uder's _id)
    await req.user.populate({
      path: 'tasks',
      match, // include additional conditions to look for the tasks
      options: {
        limit: parseInt(limit), // if not given will be ignored
        skip: parseInt(skip),
        sort,
      },
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
