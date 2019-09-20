require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV, CLIENT_ORIGIN } = require('./config')

const authRouter = require('./authe/authe-router')
const projectsRouter = require('./projects/projects-router')
const paymentsRouter = require('./payments/payments-router')
const usersRouter = require('./users/users-router')

const { requireAuth } = require('./middleware/jwt-authe')

const app = express()
const morganOption = { NODE_ENV } === 'production' ? 'tiny' : 'common'

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
//   cors({
//     origin: CLIENT_ORIGIN
//   })
// )

app.use('/api/projects', requireAuth, projectsRouter)
app.use('/api/payments', requireAuth, paymentsRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)

app.use(function errorHandler(error, req, res, next) {
  let response
  if ({ NODE_ENV } === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app
