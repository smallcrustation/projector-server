const AuthService = require('../authe/authe-service')

const requireAuth = async (req, res, next) => {
  const authToken = req.get('Authorization') || ''

  let token

  if (!authToken.toLowerCase().startsWith('bearer')) {
    return res.status(401).json({ error: 'Missing Bearer token' })
  }

  token = authToken.slice('bearer '.length, authToken.length)

  try {
    const payload = await AuthService.verifyJwt(token) // payload ex: { user_id: 3, iat: 1568212680, sub: 'krill' }
    // console.log(payload)
    const user = await AuthService.getUserWithUserName(
      req.app.get('db'),
      payload.sub
    )
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }

    // adding user to req object after they are authenticated
    req.user = user

    next()
  } catch (err) {
     res.status(401).json({ error: 'Unauthorized request' })
  }
}

module.exports = {
  requireAuth
}
