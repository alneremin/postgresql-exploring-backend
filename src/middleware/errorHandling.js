const Result = require('../utils/result')
const logger = require('../utils/logger')

const getMetaFromError = error => {
  try {
    const { stack } = error
    let info = stack.split('\n')[1].split('\\')
    let meta = info[info.length - 1]
    let fileName = meta.split(':')[0]
    let lineNumber = meta.split(':')[1]
    return `${fileName}: ${lineNumber}`
  }
  catch {
    return null
  }
}

const errorHandler = (error, _req, res, next) => {
  let result = new Result()
  if (error) {
    if (!['ValidationError', 'NotFoundError'].includes(error.name)) {
      const location = getMetaFromError(error)
      logger.error(Object.assign(
        { name: error.name },
        error.message ? { message: error.message } : {},
        location ? { location } : {})
      )
    }
    switch (error.name) {
      case 'CustomError':
        result.setUnprocessable()
        result.setErrorMessage(error.message)
        break
      default:
        result.setServerError()
        break
    }
  }
  else {
    logger.error({ message: 'Data Not Found' })
    result.setUnknownError()
  }
  res.status(result.status).send(result)
}

module.exports = errorHandler