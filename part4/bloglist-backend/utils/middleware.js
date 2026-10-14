
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:', request.path)
  console.log('Body:', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }

  next()
}

const userExtractor = (request, response, next) => {
  try {
    if (!request.token) {
      return response.status(401).json({
        error: 'token missing',
      })
    }

    const decodedToken = jwt.verify(
      request.token,
      process.env.SECRET
    )

    request.user = decodedToken
    next()
  } catch (error) {
    return response.status(401).json({
      error: 'invalid token',
    })
  }
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  tokenExtractor,
  userExtractor,
}
