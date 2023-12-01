const express = require('express')
const Task = require('../models/task')

const router = new express.Router()

router.post('/tasks', async (req, res) => {
  const task = new Task(req.body)

  try {
    await task.save()
    res.status(201).send(task)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.get('/tasks', async (_, res) => {
  try {
    const tasks = await Task.find({})
    res.send(tasks)
  } catch (err) {
    res.status(500).send(err)
  }
})

router.get('/tasks/:id', async (req, res) => {
  const taskId = req.params.id

  try {
    const task = await Task.findById(taskId)
    if (!task) {
      res.status(404).send()
      return
    }
    res.send(task)
  } catch (err) {
    res.status(500).send(err)
  }
})

router.patch('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  const updates = req.body
  const allowedUpdates = ['description', 'completed']

  if (!Object.keys(updates).every((u) => allowedUpdates.includes(u))) {
    res.status(400).send({error: `Invalid param, can only update: ${allowedUpdates.join(', ')}`})
    return
  }

  try {
    const task = await Task.findByIdAndUpdate(taskId, updates, {
      new: true,
      runValidators: true,
    })

    if (!task) {
      res.status(404).send()
      return
    }
    res.send(task)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  try {
    const task = await Task.findByIdAndDelete(taskId)
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
