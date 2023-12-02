const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  owner: {
    ref: 'User', // ref another schema
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task
