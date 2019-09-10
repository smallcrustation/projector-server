const express = require('express')
const AuthService = require('./auth-service')

const authRouter = express.Router()
const jsonBodyParser = express.json()

authRouter.route('/login')
  .post(jsonBodyParser, async (req, res, next) => {
    const {username, pass} = req.body
    const loginUser = {username, pass}

    if(!loginUser.username || !loginUser.pass){
      return res.status(400).json({
        error: `Missing '${!loginUser.username?'Username':'Password'}' in req body`
      })
    }

    try{
      const user = await AuthService.getUserByUsername(req.app.get('db'), loginUser.user_name)
      if(!user){
        return res.status(400).json({
          error: 'Incorrect username or password'
        })
      }

      const passwordsMatch = await AuthService.comparePasswords(loginUser.password, user.password)
      if(!passwordsMatch){
        return res.status(400).json({
          error: 'Incorrect username or password'
        })
      }

      const subject = user.username
      const payload = {user_id: user.id}
      res.send({
        authToken: AuthService.createJwt(subject, payload)
      })
    } catch(err){
      next(err)
    }
  }) 