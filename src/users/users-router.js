const express = require('express')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const bodyParser = express.json()

usersRouter.route('/')
  .post(bodyParser, async (req, res, next) => {
  // get username, email, password. validate. hashPass. clean. insert. return.
  const { username, email, password } = req.body
  const newUser = { username, email, password }

  try {
    // validate 
    const validUserFields = await UsersService.validateFields(req.app.get('db'), newUser)
    if (validUserFields.error) {
      return res.status(400).json(validUserFields)
    }

    // hash pass
    newUser.password = await UsersService.hashPass(newUser.password)
    // sanitize 'xss'
    const cleanNewUser = UsersService.sanitizeUser(newUser)
    // insert 
    const savedUser = await UsersService.insertUser(req.app.get('db'), cleanNewUser)

    res.status(200).json(savedUser)

  } catch (err) {
    next(err)
  }
})

module.exports = usersRouter
