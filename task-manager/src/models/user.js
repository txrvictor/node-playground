const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Task = require('./task')

const HASH_SALT = 8

// just for practice, shouldn't be in the code but in some .env var
const JWT_SECRET = 'somesecretthatshouldbeinenv'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email')
      }
    },
  },
  password: {
    type: String, // should save it hashed, just for simplification
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password shold not contain "password')
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive value')
      }
    },
  },
  // track user jwt tokens
  tokens: [{
    token: {
      type: String,
      required: true,
    }
  }],
})

// set up a virtual property to setup the relationship 
// between user and task
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id', // (similar to "primary key")
  foreignField: 'owner', // (similar to "foreigner key" on User)
})

// setup instances of User methods (user.generateAuthToken)
userSchema.methods.generateAuthToken = async function() {
  const user = this
  const token = jwt.sign({_id: user._id.toString()}, JWT_SECRET)

  user.tokens = user.tokens.concat({token})

  // store it in DB
  await user.save()
  
  return token
}

// override method so when it's parsed to JSON when sent back 
// through the API response, we can ommit some infomation
userSchema.methods.toJSON = function() {
  const user = this
  const obj = user.toObject()

  delete obj.password
  delete obj.tokens

  return obj
}

// setup static model methods (Users.findByCredentials)
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({email})
  const loginError = new Error('Unable to login')

  if (!user) {
    throw loginError
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw loginError
  }

  return user
}

// -- middleware "pre" (before) events:
// (do not use arrow functions because we need the binding)

// hash password when saving user
userSchema.pre('save', async function(next) {
  // "this" refers to the document (user) which we will "save"
  const user = this
  
  // check if 'password' was updated (or when it was created)
  // hash it so we do not store plain passwords
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, HASH_SALT)
  }

  // call next to indicate we're done with this pre-processing
  next()
})

// cascade delete user's tasks when user is deleted
userSchema.pre('remove', async function(next) {
  const user = this

  await Task.deleteMany({owner: user._id})

  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
