const bcrypt = require('bcrypt')
const xss = require('xss')

UsersService = {
  async validateFields(db, newUser) {
    // prepare result obj
    result = {}

    for (key in newUser) {
      // check if data
      if (!newUser.username || !newUser.email || !newUser.password) {
        return (result.error = `missing ${key} in response body`)
      }
      // check for whitespace
      if (newUser[key].startsWith(' ') || newUser[key].endsWith(' ')) {
        result.error = `${key} end or begin with spaces`
      }
    }

    //check if username already exists in db
    const userFound = await db('projector_users')
      .where('username', newUser.username)
      .select('*')
    if (userFound.length) {
      result.error = 'Username already exists'
    }

    // check password is at least 5 chars long and max 72
    if (newUser.password.length > 4 || newUser.password.length > 72) {
      result.error = 'Password must be between 5 and 72 characters'
    }

    return result
  },

  hashPass(password) {
    return bcrypt.hash(password, 10)
  },

  sanitizeUser(newUser){
    return {
      username: xss(newUser.username),
      email: xss(newUser.email),
      password: xss(newUser.password) // what if pass looks like html...
    }
  },

  insertUser(db, newUser){
    return db('projector_users')
      .insert(newUser)
      .returning('*')
  }
}

module.exports = UsersService
