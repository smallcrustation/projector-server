const AuthService = require('../auth/auth-service')

const requireAuth = async (req, res, next) => {
  const authToken = req.get('Authorization' || '')
  let token;

  if(!authToken.toLowerCase().startsWith('bearer')){
    return res.status(401).json({ error: 'Missing bearer token'})
  }

  token = authToken.slice('bearer '.length, authToken.length)

  try{
    const payload = await AuthService.verifyJwt(token)
    const user = await AuthService.getUserWithUserName(
      req.app.get('db'),
      payload.subject
    )
    if(!user){
      return res.status(401).json({ error: 'Unauthorized request' })
    }

    // adding user to req object after they are authenticated
    req.user = user

    next()
  } catch(err){
    next(err)
  }
}

module.exports = { 
  requireAuth
}