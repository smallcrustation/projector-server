const config = require('../config')
const bcrypt = require('bcrypt')

const AuthService = {

  getUserWithUserName(db, user_name) {
    return db('projector_users')
      .where({ user_name })
      .first('*')
  },

  comparePasswords(LoginUserPass, dbUserPass){
    return bcrypt.compare(LoginUserPass, dbUserPass)
  }

}
