const jwt = require('jsonwebtoken')
const User = require('../models/user')

// just for practice, shouldn't be in the code but in some .env var
const JWT_SECRET = 'somesecretthatshouldbeinenv'

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await User.findOne({
      _id: decoded._id, // find by id
      'tokens.token': token, // any value in the array has this token
    })

    if (!user) {
      throw new Error()
    }

    // save the retrieved user in the req so it's accessible inside
    // the authenticated routes
    req.user = user
    req.token = token

    next()
  } catch (err) {
    res.status(401).send({error: 'Please authenticate'})
  }
}

module.exports = auth
