const logger = require('./logger')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method,
        '\nPath:  ', request.path,
        '\nBody:  ', request.body)
    next()
}

const unknownEndpoint = (request, response, next) => {
    response.status(404).send({error: 'unknown endpoint'})
    next()
}

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({error: error.message})
    }
    logger.error(error.name, error.message)
    next(error)
}
const tokenExtractor = (request, response, next) => {
    let authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer '))
        authorization = authorization.substring(7)
    //console.log('authorization: ~~> '+authorization)
    request.token = authorization
    next()
}
module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor
}
