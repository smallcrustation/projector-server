const {JWT_SECRET} = require('../config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const AuthService = {

  getUserWithUserName(db, username) {
    console.log('USERNAME: ', username)
    return db('projector_users')
      .where({ username })
      .first('*')
  },

  comparePasswords(LoginUserPass, dbUserPass){
    console.log('LoginUserPass: ', LoginUserPass)
    console.log('dbUserPass: ', dbUserPass)
    return bcrypt.compare(LoginUserPass, dbUserPass)
  },

  createJwt(subject, payload){
    return jwt.sign(payload, JWT_SECRET, {
      subject,
      algorithm: 'HS256'
    })
  },

  verifyJwt(token){
    return jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256']
    })
  }

}

module.exports = AuthService
